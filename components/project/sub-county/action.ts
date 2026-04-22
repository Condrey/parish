"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { subCountyDataInclude } from "@/lib/types";
import { subCountySchema, SubCountySchema } from "@/lib/validation";
import { cache } from "react";

export async function getDistrictEnums() {
  return await prisma.district.findMany();
}
async function allSubCounties() {
  return await prisma.subCounty.findMany({
    include: subCountyDataInclude,
    orderBy: { name: "asc" },
  });
}
export const getAllSubCounties = cache(allSubCounties);

async function subCountyById(id: string) {
  return await prisma.subCounty.findUnique({
    where: { id },
    include: subCountyDataInclude,
  });
}
export const getSubCountyById = cache(subCountyById);

export async function upsertSubCounty(formData: SubCountySchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  console.log({ formData });

  const { id, districtId, name } = subCountySchema.parse(formData);
  const data = await prisma.subCounty.upsert({
    where: { id },
    create: {
      name,
      district: { connect: { id: districtId } },
    },
    update: { name, district: { connect: { id: districtId } } },
    include: subCountyDataInclude,
  });
  return data;
}

export async function deleteSubCounty(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.subCounty.delete({
    where: { id },
    include: subCountyDataInclude,
  });
}
