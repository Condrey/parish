import { webName } from "@/lib/utils";
import { sendMail } from "../../../(email)/nodemailer";

export const sendEmailVerificationLink = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL + "/email-verification/" + token;
  const subject = "Email Verification Link";
  const htmlContent = `
    <p>Hi there!</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${url}">Verify Email</a></p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>${webName}</p>
`;
  try {
    await sendMail(email, {
      subject,
      html: htmlContent,
      replyTo: "@noreply.com",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send verification link.");
  }
};
