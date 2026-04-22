import prisma from "@/lib/prisma";
import crypto from "crypto";

const EXPIRES_IN = 1000 * 60 * 5; // 5 mins

export const generateOtpVerificationToken = async (userId: string) => {
  const storedUserTokens = await prisma.passwordResetToken.findMany({
    where: { userId },
  });
  if (!!storedUserTokens.length) {
    const reuseableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reuseableStoredToken) return reuseableStoredToken.id;
  }
  const otp = generateAlphanumericOtp();
  await prisma.passwordResetToken.create({
    data: {
      expires: new Date().getTime() + EXPIRES_IN,
      userId,
      id: hashOtp(otp),
    },
  });
  return otp;
};

export const validateOtpVerificationToken = async (otp: string) => {
  try {
    const storedToken = await prisma.$transaction(
      async (tx) => {
        const storedToken = await tx.passwordResetToken.findUnique({
          where: { id: hashOtp(otp) },
        });
        if (!storedToken) throw new Error("Invalid OTP verification code");
        await tx.passwordResetToken.deleteMany({
          where: {
            userId: storedToken.userId,
            //  id: { not: hashOtp(otp) }
          },
        });
        return storedToken;
      },
      {
        maxWait: 60000,
        timeout: 60000,
      },
    );
    const tokenExpires = Number(storedToken.expires);
    if (!isWithinExpiration(tokenExpires)) {
      throw new Error("Expired OTP verification code");
    }
    return { error: null };
  } catch (error) {
    return { error: `${error}` };
  }
};

function generateAlphanumericOtp(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTWXYZ23456789";

  let otp = "";
  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, chars.length);
    otp += chars[index];
  }

  return otp.toUpperCase();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
function isWithinExpiration(expiration: number): boolean {
  const currentTimeMills = new Date().getTime();
  return expiration > currentTimeMills;
}
