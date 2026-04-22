/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import { Gender, Role, Status } from "./generated/prisma/enums";
import { formatPersonName } from "./utils";
const requiredString = z.string().trim();

export const excelToDate = (serial: any) => {
  if (typeof serial !== "number") {
    console.error("Invalid serial number for date conversion:", serial);
    throw new Error("Invalid Date");
  }
  return new Date(
    Date.UTC(1899, 11, 30) + Number(serial) * 24 * 60 * 60 * 1000,
  );
};

// Signup
export const signUpSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  email: z
    .email()
    .min(1, "Please an email is required")
    .describe("Email for signing up"),
  name: requiredString
    .min(1, "Please provide a name")
    .transform(formatPersonName),
  username: requiredString.optional().describe("User username for the user."),
  password: z.string().optional().describe("Password for the user."),
  role: z.enum(Role, { error: "Please choose a correct role." }),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  username: requiredString.min(
    1,
    "Please input your username or email that you registered with.",
  ),
  password: requiredString
    .min(1, "Password is required to login")
    .describe("Password that you registered with."),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const verifyUserSchema = z.object({
  name: requiredString
    .min(1, "Name must be provided.")
    .transform(formatPersonName),
  id: requiredString.min(1, "User id is missing"),
  email: z.email().trim().min(1, "A working email is required"),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
});
export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;

// Update password
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .email()
      .min(8, "Password must be at least 8 characters")
      .describe("Password for the user."),
    newPassword: z
      .email()
      .min(8, "Password must be at least 8 characters")
      .describe("Password for the user."),
    repeatPassword: z
      .email()
      .min(8, "Password must be at least 8 characters")
      .describe("Password for the user."),
  })
  .superRefine((val, ctx) => {
    if (val.newPassword === val.currentPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "Enter a password different from the current password.",
        code: "custom",
      });
    }
    if (val.newPassword !== val.repeatPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message:
          "There is a password mismatch in the current and repeated password.",
        code: "custom",
      });
    }
  });
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

// Password reset
export const passwordResetSchema = z
  .object({
    emailUsername: z
      .email()
      .min(1, "Please provide your email")
      .describe("Email or username for the user."),
    otp: z.string().optional(),
    newPassword: z.string().optional().describe("Password for the user."),
    repeatPassword: z.string().optional().describe("Password for the user."),
  })
  .superRefine((val, ctx) => {
    if (!!val.otp) {
      if ((!val.newPassword && val.newPassword?.length) || 0 < 8) {
        ctx.addIssue({
          path: ["newPassword"],
          message: "Password must be at least 8 characters",
          code: "custom",
        });
      }
      if ((!val.repeatPassword && val.repeatPassword?.length) || 0 < 8) {
        ctx.addIssue({
          path: ["repeatPassword"],
          message: "Password must be at least 8 characters",
          code: "custom",
        });
      }
    }

    if (val.newPassword !== val.repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        message:
          "There is a password mismatch in the current and repeated password.",
        code: "custom",
      });
    }
  });
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;

// district
export const districtSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "District name is required"),
  voteNumber: z
    .number()
    .min(1, "Vote number is required")
    .describe("Vote number for the district"),
  votePhysicalAddress: requiredString
    .min(1, "Vote physical address is required")
    .describe("Vote physical address for the district"),
  votePostalAddress: requiredString
    .min(1, "Vote postal address is required")
    .describe("Vote postal address for the district"),
});
export type DistrictSchema = z.infer<typeof districtSchema>;

// Sub-county
export const subCountySchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Sub-county name is required"),
  districtId: requiredString
    .min(1, "District id is required")
    .describe("District id for the sub-county"),
});
export type SubCountySchema = z.infer<typeof subCountySchema>;

// Parish
export const parishSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Parish name is required"),
  subCountyId: requiredString
    .min(1, "Sub-county id is required")
    .describe("Sub-county id for the parish"),
});
export type ParishSchema = z.infer<typeof parishSchema>;

// Village
export const villageSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Village name is required"),
  parishId: requiredString
    .min(1, "Parish id is required")
    .describe("Parish id for the village"),
});
export type VillageSchema = z.infer<typeof villageSchema>;

// Sacco group
export const saccoGroupSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Sacco group name is required"),
  villageId: requiredString
    .min(1, "Village id is required")
    .describe("Village id for the sacco group"),
});
export type SaccoGroupSchema = z.infer<typeof saccoGroupSchema>;

export const beneficiarySchema = z.object({
  id: z.string().optional(),
  fullName: requiredString.min(1, "Beneficiary name is required"),
  memberId: requiredString
    .min(1, "Member id is required")
    .describe("Member id for the beneficiary"),
  nin: requiredString.optional().describe("NIN for the beneficiary"),
  contact: requiredString.optional().describe("Contact for the beneficiary"),
  gender: z.enum(Gender, { error: "Please choose a correct gender" }),
  email: z.email().optional().describe("Email for the beneficiary"),
  status: z.enum(Status, {
    error: "Please choose a right status",
  }),
  subsistence: z
    .string()
    .optional()
    .describe("Subsistence for the beneficiary"),
  saccoGroupId: requiredString
    .min(1, "Sacco group id is required")
    .describe("Sacco group id for the beneficiary"),
});
export type BeneficiarySchema = z.infer<typeof beneficiarySchema>;

export const bulkBeneficiaryUploadSchema = z.object({
  sn: z.string().optional(),
  fullname: z
    .string()
    .trim()
    .min(4, "Please enter a valid name with more than 8 characters"),
  memberId: requiredString
    .trim()
    .min(1, "Member id is required")
    .describe("Member id for the beneficiary"),
  nin: z.string().min(14, "The NIN provided is incorrect").trim().max(14),
  gender: z.enum(["M", "F"]),
  contact: z
    .string()
    .trim()
    .transform((v) => (typeof v === "number" ? String(v) : v))
    .refine((val) => val.startsWith("256"), {
      message: "Contact should start with 256",
    }),
  email: z.string().trim().optional().describe("Email for the beneficiary"),
  enterpriseGroupName: requiredString
    .trim()
    .min(1, "Enterprise group is required")
    .describe("Enterprise group for the beneficiary"),
  status: z.enum(["Active", "Inactive"], {
    error: "Please choose a right status",
  }),
  subsistence: z
    .enum(["Yes", "No"], {
      error: "Please choose whether or not it is subsistence",
    })
    .optional()
    .describe("Subsistence for the beneficiary"),
  district: z.string().trim().min(1, "Please provide the district"),
  subCounty: z.string().trim().min(1, "Please provide the subCounty"),
  parish: z.string().trim().min(1, "Please provide the parish"),
  village: z.string().trim().min(1, "Please provide the village"),
  createdAt: z.date().transform((val) => {
    if (val == null) return new Date();
    if (typeof val === "number") {
      return excelToDate(val);
    }
    if (typeof val === "string") {
      const num = Number(val);
      if (!Number.isNaN(num)) return excelToDate(num);
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    if (val instanceof Date) return val;
    return new Date();
  }),
});
export const bulkBeneficiaryUploadArraySchema = z.object({
  beneficiaries: z.array(bulkBeneficiaryUploadSchema),
});
export type BulkBeneficiaryUploadSchema = z.infer<
  typeof bulkBeneficiaryUploadSchema
>;
export type BulkBeneficiaryUploadArray = z.infer<
  typeof bulkBeneficiaryUploadArraySchema
>;

// miscellaneous
export const emailSchema = z.object({ email: z.email().trim() });
export type EmailSchema = z.infer<typeof emailSchema>;

export const singleContentSchema = z.object({ singleContent: requiredString });
export type SingleContentSchema = z.infer<typeof singleContentSchema>;

export const singleContentDateSchema = z.object({
  singleContentDate: z.date({ error: "Please enter a correct date." }),
});
export type SingleContentDateSchema = z.infer<typeof singleContentDateSchema>;
