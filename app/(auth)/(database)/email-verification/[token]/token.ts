import prisma from "@/lib/prisma";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
  const storedUserTokens = await prisma.emailVerificationToken.findMany({
    where: { userId },
  });
  if (!!storedUserTokens.length) {
    const reuseableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reuseableStoredToken) return reuseableStoredToken.id;
  }
  const token = generateRandomString({ length: 63 });
  await prisma.emailVerificationToken.create({
    data: { id: token, expires: new Date().getTime() + EXPIRES_IN, userId },
  });
  return token;
};

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await prisma.$transaction(
    async (tx) => {
      const storedToken = await tx.emailVerificationToken.findUnique({
        where: { id: token },
      });
      if (!storedToken) throw new Error("Invalid token");
      await tx.emailVerificationToken.deleteMany({
        where: { userId: storedToken.userId },
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
    throw new Error("Expired token");
  }
  return storedToken.userId;
};

function generateRandomString({
  length,
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}: {
  length: number;
  alphabet?: string;
}): string {
  let result = "";
  const alphabetLength = alphabet.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetLength);
    result += alphabet[randomIndex];
  }

  return result;
}

function isWithinExpiration(expiration: number): boolean {
  const currentTimeMills = new Date().getTime();
  return expiration > currentTimeMills;
}
