"use server";

import { createSession } from "@/app/(auth)/lib/session";
import {
  generateSessionToken,
  setSessionTokenCookie,
} from "@/app/(auth)/lib/tokens";
import prisma from "@/lib/prisma";
import { passwordResetSchema, PasswordResetSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { sendAlphaNumericOtp } from "./email";
import {
  generateOtpVerificationToken,
  validateOtpVerificationToken,
} from "./otp";

export async function validateEmail({ input }: { input: PasswordResetSchema }) {
  const { emailUsername } = passwordResetSchema.parse(input);
  const existingUser = await prisma.user.findFirst({
    where: {
      email: { mode: "insensitive", equals: emailUsername },
    },
  });
  if (!existingUser) {
    console.error("User does not exist", emailUsername);
    return {
      error: "Incorrect username or email .",
    };
  }
  try {
    const otp = await generateOtpVerificationToken(existingUser.id);
    await sendAlphaNumericOtp({
      email: existingUser.email!,
      otp,
    });
  } catch (error) {
    return { error: `${error}` };
  }
  return { error: null };
}

export async function verifyOtp({ input }: { input: PasswordResetSchema }) {
  const { emailUsername, otp } = passwordResetSchema.parse(input);
  const existingUser = await prisma.user.findFirst({
    where: {
      email: { mode: "insensitive", equals: emailUsername },
    },
  });
  if (!existingUser) {
    console.error("User does not exist", emailUsername);
    return {
      error: "Incorrect username or email .",
    };
  }
  const { error } = await validateOtpVerificationToken(otp!);
  return { error };
}

export async function resetPasswordAndLogin({
  input,
}: {
  input: PasswordResetSchema;
}) {
  const { newPassword, repeatPassword, emailUsername } =
    passwordResetSchema.parse(input);
  try {
    if (repeatPassword !== newPassword) {
      return {
        error:
          "There is a password mismatch, the new password does not match the repeated password.",
      };
    }
    const { error } = await verifyOtp({ input });

    if (error) {
      return { error: `${error}` };
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email: { mode: "insensitive", equals: emailUsername },
      },
    });
    if (!existingUser) {
      console.error("User does not exist", emailUsername);
      return {
        error: "Incorrect username or email .",
      };
    }

    const passwordHash = await hash(newPassword!, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash },
    });
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return { error: null };
  } catch (error) {
    return {
      error: `Failed to reset password. Contact your administrator: ${error}`,
    };
  }
}
