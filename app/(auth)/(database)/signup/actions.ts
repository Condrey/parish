"use server";

import prisma from "@/lib/prisma";
import { signUpSchema, SignUpSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";

export async function signUp(
  credentials: SignUpSchema,
): Promise<{ error: string }> {
  const { email, name, password, role } = signUpSchema.parse(credentials);
  const passwordHash = await hash(password!, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: {
        equals: email!,
        mode: "insensitive",
      },
    },
  });
  if (existingEmail) {
    return {
      error:
        "Email is already taken or has been used to register before, just login",
    };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: email!,
      passwordHash,
      role: "ADMIN",
    },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/");
}
