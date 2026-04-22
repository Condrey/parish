"use server";

import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { generateEmailVerificationToken } from "../email-verification/[token]/token";
import { sendEmailVerificationLink } from "./email";

export async function verifyUser({
  input,
  loginRedirectUrl,
}: {
  input: VerifyUserSchema;
  loginRedirectUrl: string;
}): Promise<{ error: string }> {
  console.log("verifying user starts");
  const { email, id, name, password } = verifyUserSchema.parse(input);
  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const error = await prisma.$transaction(
      async (tx) => {
        const dbUser = await tx.user.findUnique({ where: { id } });
        if (!dbUser) {
          return { error: "User does not exist." };
        }

        const userWithEmail = await tx.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (!!userWithEmail && dbUser.email !== email) {
          return { error: "Email already exists." };
        }

        await tx.user.update({
          where: { id },
          data: {
            email,
            name,
            passwordHash,
          },
        });
      },
      { maxWait: 60000, timeout: 60000 },
    );
    console.log("error", error);
    if (!!error) {
      console.error("error", error);
      return error;
    }

    const token = await generateEmailVerificationToken(id);
    await sendEmailVerificationLink({ email, token, loginRedirectUrl });
  } catch (error) {
    console.error("User verification Error: ", error);
  }
  redirect(
    `/email-verification/token-${email}?${REDIRECT_TO_URL_SEARCH_PARAMS}=${encodeURIComponent(loginRedirectUrl)}`,
  );
}
