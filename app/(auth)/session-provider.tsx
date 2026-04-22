"use client";

import { createContext, useContext } from "react";
import { LuciaSession, LuciaUser } from "./lib/types";

type SessionContext =
  | { user: LuciaUser; session: LuciaSession | null }
  | { user: LuciaUser | null; session: LuciaSession | null };

const sessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(sessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}
