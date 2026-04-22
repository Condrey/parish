"use server";

import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { loginSchema, LoginSchema } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";

export async function loginAction(
  credentials: LoginSchema,
  loginRedirectUrl: string,
): Promise<{ error: string }> {
  const { username, password } = loginSchema.parse(credentials);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: { mode: "insensitive", equals: username },
    },
  });
  if (!existingUser) {
    console.error("User does not exist", credentials);
    return {
      error: "Incorrect username, email or password.",
    };
  }

  const validPassword = await verify(existingUser.passwordHash!, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    console.error("Wrong password input, ", password);
    return {
      error: "Incorrect username, email or password.",
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, existingUser.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  // return {
  // 	error: JSON.stringify(session, null, 2)
  // };
  // Avoiding phishing
  if (!loginRedirectUrl.startsWith("/")) {
    loginRedirectUrl = "/";
  }
  if (loginRedirectUrl === "/") {
    loginRedirectUrl = "/";
  }
  return redirect(
    existingUser.isVerified
      ? loginRedirectUrl
      : `/user-verification/${existingUser.id}?${REDIRECT_TO_URL_SEARCH_PARAMS}=${encodeURIComponent(loginRedirectUrl)}`,
  );
}
