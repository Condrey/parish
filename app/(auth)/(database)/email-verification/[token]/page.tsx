import prisma from "@/lib/prisma";
import { Metadata } from "next";
import EmailVerificationForm from "./email-verification-form";
import { validateEmailVerificationToken } from "./token";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function scrapeUser(token: string) {
  const userId = await validateEmailVerificationToken(token);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      emailVerified: true,
    },
  });
  return user;
}

export const metadata: Metadata = {
  title: "Email verification",
};
export default async function Page({ params }: PageProps) {
  const { token: encodedToken } = await params;
  const token = decodeURIComponent(encodedToken);

  if (!token || token.startsWith("token")) {
    const email = decodeURIComponent(token.split("-")[1]);
    return <EmailVerificationForm email={email} />;
  }
  const user = await scrapeUser(token);
  if (!user) throw new Error("User not found");
  const { email } = user;

  return <EmailVerificationForm email={email!} />;
}
