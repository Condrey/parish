/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateRequest } from "@/app/(auth)/auth";
import { organization } from "@/lib/utils";
import { subYears } from "date-fns";
import ExcelJS from "exceljs";
import path from "path";

export async function POST(req: Request) {
  const { district } = await req.json();
  const { user } = await validateRequest();
  const now = new Date();
  const _100YearsAgo = subYears(now, 100);
  // create a new workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("beneficiaries_template");

  // Insert Lira City Logo
  const logoId = workbook.addImage({
    filename: path.join(process.cwd(), "public", "logo.png"),
    extension: "png",
  });
  sheet.addImage(logoId, {
    tl: { col: 0.9, row: 0.1 },
    ext: { width: 185, height: 70 },
  });

  // title: uppercase
  sheet.mergeCells("C1:O1");
  sheet.getCell("C1").value =
    `${organization} – Beneficiaries Bulk Upload Template`.toUpperCase();
  sheet.getCell("C1").style = {
    font: { bold: true, size: 18, color: { argb: "000000" } },
    alignment: { horizontal: "left", vertical: "middle" },
  };

  // subtitle: black color
  sheet.mergeCells("C2:O2");
  sheet.getCell("C2").value = `${district}`.toUpperCase();
  sheet.getCell("C2").style = {
    font: { bold: true, size: 16, color: { argb: "000000" } },
    alignment: { horizontal: "left", vertical: "middle" },
  };

  // author: Grey color
  if (user) {
    sheet.mergeCells("C3:O3");
    sheet.getCell("C3").value = `Downloaded by: ${user?.name}`;
    sheet.getCell("C3").style = {
      font: { bold: true, size: 12, color: { argb: "000000" } },
      alignment: { horizontal: "left", vertical: "middle" },
    };
  }

  // ---Header Row---
  const headers = [
    "Sn",
    "FullName",
    "Member Id",
    "NIN",
    "M/F",
    "Contact",
    "Email",
    "Enterprise Group Name",
    "Status",
    "Subsistence",
    "District",
    "Subcounty",
    "Parish",
    "Village",
    "Date Created",
  ];
  if (!user) {
    sheet.addRow([]);
  }
  const headerRow = sheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white text
    cell.border = {
      //   top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  //   ---Column widths---
  const colWidths = [5, 30, 25, 20, 5, 20, 25, 30, 10, 15, 20, 25, 25, 25, 20];
  colWidths.forEach((width, i) => {
    const col = i + 1;
    sheet.getColumn(col).width = width;
  });
  // --- 10 Empty Rows with Borders ---
  for (let i = 0; i < 20; i++) {
    const row = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }
  // ---VALIDATIONS---
  // 1. sn
  (sheet as any).dataValidations.add("A5:A10003", {
    type: "whole",
    operator: "greaterThan",
    formulae: [0],
    allowBlank: false,
  });
  // 2. fullName
  (sheet as any).dataValidations.add("B5:B10003", {
    type: "custom",
    allowBlank: false,
    formulae: ["LEN(B5)>=4"],
    showInputMessage: true,
    promptTitle: "Validation",
    prompt: "Please enter a full name with at least 4 characters.",
  });
  // 3. MemberId
  (sheet as any).dataValidations.add("C5:C10003", {
    type: "custom",
    allowBlank: false,
    formulae: ["LEN(C5)>=4"],
    showInputMessage: true,
    promptTitle: "Validation",
    prompt: "Please enter a member ID with at least 4 characters.",
  });

  // 4. nin
  (sheet as any).dataValidations.add("D5:D10003", {
    type: "custom",
    allowBlank: true,
    formulae: ["LEN(D5)=14"],
    showInputMessage: true,
    promptTitle: "NIN Validation",
    prompt:
      "Please enter a valid National Id number with exactly 14 characters.",
  });
  // 5. Gender
  (sheet as any).dataValidations.add("E5:E10003", {
    type: "list",
    allowBlank: true,
    formulae: ['"M,F"'],
    showInputMessage: true,
    promptTitle: "Select Gender",
    prompt: "Please select a gender from the dropdown list.",
  });
  // 6. contact
  sheet.getColumn(5).numFmt = "@"; // Text format to preserve leading zeros
  (sheet as any).dataValidations.add("F5:F10003", {
    type: "custom",
    allowBlank: false,
    formulae: ['=LEFT(F5,3)="256"'],
    showInputMessage: true,
    promptTitle: "Uganda number Validation",
    prompt: "Please enter a Uganda number starting with 256.",
  });
  // 7. email
  (sheet as any).dataValidations.add("G5:G10003", {
    type: "custom",
    allowBlank: false,
    formulae: [
      'AND(ISNUMBER(FIND("@",G5)),ISNUMBER(FIND(".",G5)),FIND("@",G5)<FIND(".",G5),LEN(G5)>5)',
    ],
    showInputMessage: true,
    promptTitle: "Validation",
    prompt:
      "Please enter a correct email address with @,., and at least 6 characters.",
  });
  // 8 Enterprise group
  (sheet as any).dataValidations.add("H5:H10003", {
    type: "custom",
    allowBlank: false,
    formulae: ["LEN(H5)>=4"],
    showInputMessage: true,
    promptTitle: "Validation",
    prompt: "Please enter enterprise group with at least 4 characters.",
  });
  // 9  status
  (sheet as any).dataValidations.add("I5:I10003", {
    type: "list",
    allowBlank: true,
    formulae: ['"Active,Inactive"'],
    showInputMessage: true,
    promptTitle: "Select Status",
    prompt: "Please select a status from the dropdown list.",
  });
  // // 13. date created - Date'
  // (sheet as any).dataValidations.add("O5:O10003", {
  //   type: "date",
  //   allowBlank: false,
  //   operator: "dot",
  //   formulae: [_100YearsAgo.toISOString(), now.toISOString()],
  //   showInputMessage: true,
  //   promptTitle: "Date Validation",
  //   prompt: `Please enter a valid date in the format from ${formatDate(
  //     _100YearsAgo,
  //     "MM/dd/yyyy",
  //   )} to today.`,
  // });
  // --- Freeze Header Row ---
  sheet.views = [{ state: "frozen", ySplit: 4 }];
  // --- Instructions Sheet ---
  const instructions = workbook.addWorksheet("Instructions");
  instructions.getColumn(1).width = 90;
  instructions.addRow(
    `INSTRUCTIONS FOR BULK UPLOAD:

1. Fill in all mandatory fields marked with *.
2. Gender must be Male or Female.
3. Do not delete or rename the first sheet.
4. Do not modify the header row.
5. Keep data clean and avoid extra spaces.
6. Upload this file back to the system when done.

Thank you,
Lira City Council ICT Team.`,
  );

  // --- Export XLSX ---
  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=beneficiaries_template.xlsx",
    },
  });
}
