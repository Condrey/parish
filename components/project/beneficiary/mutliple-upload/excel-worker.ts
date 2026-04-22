/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />
import cuid from "cuid";
import * as XLSX from "xlsx";

let isCancelled = false;

const key = (val: any) => (val ?? "").toString();

self.onmessage = async (e: MessageEvent) => {
  const { type, file } = e.data;

  if (type === "CANCEL") {
    isCancelled = true;
    return;
  }

  if (type !== "PARSE") return;

  isCancelled = false;

  try {
    const reader = new FileReaderSync();
    const data = reader.readAsArrayBuffer(file);

    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    let rows: any[] = [];

    const originalRef = sheet["!ref"];

    if (originalRef) {
      const decoded = XLSX.utils.decode_range(originalRef);
      decoded.s.r = 3;
      decoded.s.c = 0;
      decoded.e.c = Math.min(decoded.e.c, 14);

      const range = XLSX.utils.encode_range(decoded);

      rows = XLSX.utils.sheet_to_json(sheet, {
        range,
        defval: "",
        blankrows: false,
      });
    } else {
      rows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        blankrows: false,
      });
    }

    const chunkSize = 50;
    const total = rows.length;
    const result: any[] = [];

    for (let i = 0; i < rows.length; i += chunkSize) {
      if (isCancelled) {
        self.postMessage({ type: "CANCELLED" });
        return;
      }

      const chunk = rows.slice(i, i + chunkSize);

      const processed = chunk.map((item: any) => ({
        sn: cuid(),
        contact: key(item["Contact"]),
        email: item["Email"],
        district: item["District"],
        enterpriseGroupName: item["Enterprise Group Name"],
        fullname: item["FullName"],
        gender: item["M/F"],
        memberId: key(item["Member Id"]),
        nin: item["NIN"],
        parish: item["Parish"],
        status: item["Status"],
        subCounty: item["Subcounty"],
        village: item["Village"],
        subsistence: item["Subsistence"],
        createdAt: item["Date Created"], // parse later on main thread if needed
      }));

      result.push(...processed);

      const progress = Math.round((i / total) * 100);

      self.postMessage({
        type: "PROGRESS",
        progress,
      });
    }

    self.postMessage({
      type: "DONE",
      data: result,
    });
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      error: String(error),
    });
  }
};
