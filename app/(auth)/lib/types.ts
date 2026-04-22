import { Prisma, Role, Session } from "@/lib/generated/prisma/client";

export const sessionWithUserInclude = {
  user: {
    select: {
      id: true,
      role: true,
      avatarUrl: true,
      email: true,
      name: true,
      isVerified: true,
    },
  },
} satisfies Prisma.SessionInclude;
export type SessionWithUserData = Prisma.SessionGetPayload<{
  include: typeof sessionWithUserInclude;
}>;

export type LuciaSession = {
  id: string;
  lastVerifiedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  userId: string;
  role: Role;
  // bio: string | null;
  //   username: string | null;
  // telephone: string | null;
  // name: string;
};

export type LuciaUser = {
  role: Role;
  avatarUrl: string | null;
  email: string | null;
  id: string;
  isVerified: boolean;
  name: string;
  //   bio: string | null;
  //   telephone: string | null;
};

export interface LuciaSessionWithToken extends Session {
  token: string;
}
export type SessionValidationResult =
  | { session: LuciaSession; user: LuciaUser }
  | { session: null; user: null };
