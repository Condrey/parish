import { sendMail } from "@/app/(auth)/(email)/nodemailer";
import { webName } from "@/lib/utils";

export const sendAlphaNumericOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string | undefined;
}) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password/${email}?isValidEmail=yes`;
  const subject = "OTP VERIFICATION CODE";
  const htmlContent = `
    <p>Hello!</p>
    <p>Use the OTP below to reset your password at ${webName}</p>
    <p>Your verification code is: ${otp}</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <P>Navigate to the page at <a href="${url}" >${webName}</a></P>
    <p>Best regards,</p>
    <p>${webName}</p>
`;
  try {
    await Promise.all([
      await sendMail(email, {
        subject,
        html: htmlContent,
        replyTo: "@noreply.com",
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send password reset token.");
  }
};
