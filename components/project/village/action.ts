"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { villageDataInclude } from "@/lib/types";
import { villageSchema, VillageSchema } from "@/lib/validation";
import { cache } from "react";

const parishEnumDataInclude = {
  subCounty: { include: { district: true } },
} satisfies Prisma.ParishInclude;
export type ParishEnumData = Prisma.ParishGetPayload<{
  include: typeof parishEnumDataInclude;
}>;
export async function getParishEnums(): Promise<ParishEnumData[]> {
  return await prisma.parish.findMany({ include: parishEnumDataInclude });
}

async function allVillages() {
  return await prisma.village.findMany({
    include: villageDataInclude,
    orderBy: { name: "asc" },
  });
}
export const getAllVillages = cache(allVillages);

async function villageById(id: string) {
  return await prisma.village.findUnique({
    where: { id },
    include: villageDataInclude,
  });
}
export const getVillageById = cache(villageById);

export async function upsertVillage(formData: VillageSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  console.log({ formData });

  const { id, parishId, name } = villageSchema.parse(formData);
  const data = await prisma.village.upsert({
    where: { id },
    create: {
      name,
      parish: { connect: { id: parishId } },
    },
    update: { name, parish: { connect: { id: parishId } } },
    include: villageDataInclude,
  });
  return data;
}

export async function deleteVillage(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.village.delete({
    where: { id },
    include: villageDataInclude,
  });
}
