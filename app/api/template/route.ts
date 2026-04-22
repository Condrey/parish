import { Role } from "@/lib/generated/prisma/enums";
import { ParishData } from "@/lib/types";
import { put } from "@vercel/blob";
import * as carbone from "carbone";
import { formatDate } from "date-fns";
import * as path from "path";

export async function POST(req: Request, res: Response) {
  console.info("Generating PARISH document...");
  const body = await req.json();

  const parish = body as ParishData;
  const dateNow = formatDate(new Date(), "PP");
  const district = parish.subCounty?.district;
  const itOfficer = district?.officers.filter(
    (person) => person.user.role === "TECHNICAL_OFFICER",
  )[0] || {
    user: {
      id: "1",
      createdAt: new Date(),
      name: "Ogwang Coundrey James",
      email: "coundreyjames@gmail.com",
      avatarUrl: "",
      role: Role.TECHNICAL_OFFICER,
      telephone: "0776239674",
      passwordHash: "",
      isWelcomed: true,
      isVerified: true,
      emailVerified: true,
    },
  };
  // Carbone expects data as an object
  const data = {
    ...parish,
    dateNow,
    district,
    itOfficer: itOfficer.user,
    villages: parish.villages.map((v) => ({
      ...v,
      saccoGroups: v.saccoGroups.map((s) => ({
        ...s,
        activeBeneficiaries: s.beneficiaries
          .filter((b) => b.status === "ACTIVE")
          .map((b, index) => ({
            ...b,
            number: index + 1,
            gender: b.gender === "FEMALE" ? "F" : "M",
            createdAt: formatDate(b.createdAt, "PP"),
          })),
        inActiveBeneficiaries: s.beneficiaries
          .filter((b) => b.status === "INACTIVE")
          .map((b, index) => ({
            ...b,
            number: index + 1,
            gender: b.gender === "FEMALE" ? "F" : "M",
            createdAt: formatDate(b.createdAt, "PP"),
          })),
      })),
    })),
  };
  const templatePath = path.resolve(
    process.cwd(),
    "public/templates/pdm-list-template.docx",
  );
  // data.scheduleOfDuty?.clients[0].client
  try {
    const result: Buffer = await new Promise((resolve, reject) => {
      // console.log(JSON.stringify({ data }, null, 2));

      carbone.render(templatePath, data, {}, (err, result) => {
        if (err) {
          console.error("Carbone render error:", err);
          return reject(err);
        }
        resolve(Buffer.from(result));
      });
    });

    const currentTime = Date.now().toString();
    // Give a unique fileName
    const fileName = sanitizeFilename(
      `${parish.name.toUpperCase()}_PARISH_FY_VERSION_${currentTime}.docx`,
    );

    // Upload to Blob storage
    const blob = await put(fileName, result, {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 1,
    });

    // return msg
    const msg = `PARISH generated successfully for ${parish.name}`;
    return Response.json(
      { message: msg, url: blob.downloadUrl, isError: false },
      { status: 200, statusText: msg },
    );
  } catch (error) {
    console.error("Error generating PARISH:", error);
    return Response.json(
      { message: `PARISH generation failed: ${error}`, isError: true },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\/\\:*?"<>|]/g, "-");
}
