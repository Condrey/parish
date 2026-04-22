import { Role } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { addMilliseconds } from "date-fns";
import { cookies } from "next/headers";
import {
  INACTIVITY_TIMEOUT_MILLISECONDS,
  SESSION_EXPIRY_MILLISECONDS,
  TOKEN_COOKIE_SESSION_NAME,
} from "./constants";
import { deleteSessionTokenCookie, validateSessionToken } from "./tokens";
import {
  LuciaSessionWithToken,
  SessionValidationResult,
  SessionWithUserData,
  sessionWithUserInclude,
} from "./types";
import { hashSecret } from "./utils";

export async function getCurrentSession(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_SESSION_NAME)?.value ?? null;
  if (!token) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);

  return result;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await Promise.all([
    await prisma.session.delete({ where: { id: sessionId } }),
    await deleteSessionTokenCookie(),
  ]);
}
// To log out user from all devices remotely
export async function invalidateUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function createSession(
  token: string,
  userId: string,
): Promise<LuciaSessionWithToken> {
  const now = new Date();
  const tokenParts = token.split(".");
  const id = tokenParts[0];
  const secret = tokenParts[1];
  const secretHash = await hashSecret(secret);
  const expiresAt = addMilliseconds(now, SESSION_EXPIRY_MILLISECONDS);

  const dbSession = await prisma.$transaction(
    async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      return await tx.session.create({
        data: {
          id,
          userId,
          expiresAt,
          createdAt: now,
          secretHash: secretHash.toString(),
          role: user?.role || Role.TOWN_AGENT,
          lastVerifiedAt: now,
        },
      });
    },
    { timeout: 60 * 1000, maxWait: 60 * 1000 },
  );

  const session: LuciaSessionWithToken = {
    ...dbSession,
    token,
  };

  return session;
}

export async function getSessionById(
  sessionId: string,
): Promise<SessionWithUserData | null> {
  const now = new Date();

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
    include: sessionWithUserInclude,
  });
  if (!session) {
    return null;
  }
  //  Check expiration
  // If the user has been idle for 1 hour (inactivityTimeoutSeconds),
  // then go ahead and delete their session from the browser.
  if (
    now.getTime() - session.lastVerifiedAt.getTime() >=
    INACTIVITY_TIMEOUT_MILLISECONDS
  ) {
    console.info(`Session ${sessionId} expired due to inactivity.`);
    await deleteSessionById(sessionId);
    return null;
  }
  if (now.getTime() >= session.expiresAt.getTime()) {
    console.info(`Session ${sessionId} has expired.`);
    await deleteSessionById(sessionId);
    return null;
  }
  return session;
}

export async function deleteSessionById(sessionId: string): Promise<void> {
  await Promise.all([
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    }),
    // await deleteSessionTokenCookie(),
  ]);
}
