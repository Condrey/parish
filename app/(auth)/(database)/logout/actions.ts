"use server";

import { redirect } from "next/navigation";
import { validateRequest } from "../../auth";
import { globalPOSTRateLimit } from "../../lib/request";
import { invalidateSession } from "../../lib/session";

export async function logout(redirectUrl?: string) {
  if (!globalPOSTRateLimit()) {
    throw Error("Too many requests");
  }

  const { session } = await validateRequest();
  if (!session) {
    throw new Error("Unauthorized.");
  }

  await invalidateSession(session.id);
  if (!redirectUrl || !redirectUrl.startsWith("/")) {
    redirectUrl = "/";
  }
  // finally
  return redirect(redirectUrl);
}
