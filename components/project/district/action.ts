"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { districtDataInclude } from "@/lib/types";
import { districtSchema, DistrictSchema } from "@/lib/validation";
import { cache } from "react";

async function allDistricts() {
  return await prisma.district.findMany({
    include: districtDataInclude,
    orderBy: { voteNumber: "asc" },
  });
}
export const getAllDistricts = cache(allDistricts);

async function districtById(id: string) {
  return await prisma.district.findUnique({
    where: { id },
    include: districtDataInclude,
  });
}
export const getDistrictById = cache(districtById);

export async function upsertDistrict(formData: DistrictSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";

  const { name, voteNumber, votePhysicalAddress, votePostalAddress, id } =
    districtSchema.parse(formData);
  const data = await prisma.district.upsert({
    where: { id },
    create: {
      name,
      voteNumber,
      votePhysicalAddress,
      votePostalAddress,
    },
    update: { name, voteNumber, votePhysicalAddress, votePostalAddress },
    include: districtDataInclude,
  });
  return data;
}

export async function deleteDistrict(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.district.delete({
    where: { id },
    include: districtDataInclude,
  });
}
