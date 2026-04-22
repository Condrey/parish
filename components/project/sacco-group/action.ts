"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { saccoGroupDataInclude } from "@/lib/types";
import { saccoGroupSchema, SaccoGroupSchema } from "@/lib/validation";
import { cache } from "react";

const villageEnumDataInclude = {
  parish: { include: { subCounty: { include: { district: true } } } },
} satisfies Prisma.VillageInclude;
export type VillageEnumData = Prisma.VillageGetPayload<{
  include: typeof villageEnumDataInclude;
}>;
export async function getVillageEnums(): Promise<VillageEnumData[]> {
  return await prisma.village.findMany({ include: villageEnumDataInclude });
}

async function allSaccoGroups() {
  return await prisma.saccoGroup.findMany({
    include: saccoGroupDataInclude,
    orderBy: { name: "asc" },
  });
}
export const getAllSaccoGroups = cache(allSaccoGroups);

async function saccoGroupById(id: string) {
  return await prisma.saccoGroup.findUnique({
    where: { id },
    include: saccoGroupDataInclude,
  });
}
export const getSaccoGroupById = cache(saccoGroupById);

export async function upsertSaccoGroup(formData: SaccoGroupSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  console.log({ formData });

  const { id, villageId, name } = saccoGroupSchema.parse(formData);
  const data = await prisma.saccoGroup.upsert({
    where: { id },
    create: {
      name,
      village: { connect: { id: villageId } },
    },
    update: { name, village: { connect: { id: villageId } } },
    include: saccoGroupDataInclude,
  });
  return data;
}

export async function deleteSaccoGroup(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.saccoGroup.delete({
    where: { id },
    include: saccoGroupDataInclude,
  });
}
