"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { parishDataInclude } from "@/lib/types";
import { parishSchema, ParishSchema } from "@/lib/validation";
import { cache } from "react";

const subCountyEnumDataInclude = {
  district: true,
} satisfies Prisma.SubCountyInclude;
export type SubCountyEnumData = Prisma.SubCountyGetPayload<{
  include: typeof subCountyEnumDataInclude;
}>;
export async function getSubCountyEnums(): Promise<SubCountyEnumData[]> {
  return await prisma.subCounty.findMany({ include: subCountyEnumDataInclude });
}

async function allParishes() {
  return await prisma.parish.findMany({
    include: parishDataInclude,
    orderBy: { name: "asc" },
  });
}
export const getAllParishes = cache(allParishes);

async function parishById(id: string) {
  return await prisma.parish.findUnique({
    where: { id },
    include: parishDataInclude,
  });
}
export const getParishById = cache(parishById);

export async function upsertParish(formData: ParishSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  console.log({ formData });

  const { id, subCountyId, name } = parishSchema.parse(formData);
  const data = await prisma.parish.upsert({
    where: { id },
    create: {
      name,
      subCounty: { connect: { id: subCountyId } },
    },
    update: { name, subCounty: { connect: { id: subCountyId } } },
    include: parishDataInclude,
  });
  return data;
}

export async function deleteParish(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.parish.delete({
    where: { id },
    include: parishDataInclude,
  });
}

export async function getParishStatisticalData({
  subCountyId,
  parishId,
}: {
  subCountyId: string;
  parishId: string;
}) {
  const [
    parishCount,
    villageCount,
    groupCount,
    beneficiaryCount,
    beneficiaryWithLoanCount,
    beneficiaryFemaleCount,
  ] = await Promise.all([
    prisma.parish.count({
      where: { subCountyId },
    }),

    prisma.village.count({
      where: {
        parish: { subCountyId },
      },
    }),

    prisma.saccoGroup.count({
      where: {
        village: {
          parish: { subCountyId },
        },
      },
    }),

    prisma.beneficiary.count({
      where: {
        saccoGroup: {
          village: {
            parish: { subCountyId },
          },
        },
      },
    }),
    prisma.beneficiary.count({
      where: {
        status: "ACTIVE",
        saccoGroup: {
          village: {
            parish: { subCountyId },
          },
        },
      },
    }),
    prisma.beneficiary.count({
      where: {
        gender: "FEMALE",
        saccoGroup: {
          village: {
            parish: { subCountyId },
          },
        },
      },
    }),
  ]);

  const [
    _villageCount,
    _groupCount,
    _beneficiaryCount,
    _beneficiaryWithLoanCount,
    _beneficiaryFemaleCount,
  ] = await Promise.all([
    prisma.village.count({ where: { parishId } }),
    prisma.saccoGroup.count({ where: { village: { parishId } } }),
    prisma.beneficiary.count({
      where: { saccoGroup: { village: { parishId } } },
    }),
    prisma.beneficiary.count({
      where: { status: "ACTIVE", saccoGroup: { village: { parishId } } },
    }),
    prisma.beneficiary.count({
      where: { gender: "FEMALE", saccoGroup: { village: { parishId } } },
    }),
  ]);

  return {
    thisSubCounty: {
      parishCount,
      villageCount,
      groupCount,
      beneficiaryCount,
      beneficiaryWithLoanCount,
      beneficiaryFemaleCount,
      beneficiaryWithoutLoanCount: beneficiaryCount - beneficiaryWithLoanCount,
      beneficiaryMaleCount: beneficiaryCount - beneficiaryFemaleCount,

      beneficiaryWithLoanCountFraction:
        beneficiaryWithLoanCount / beneficiaryCount,
      beneficiaryFemaleCountFraction: beneficiaryFemaleCount / beneficiaryCount,
      beneficiaryWithoutLoanCountFraction:
        (beneficiaryCount - beneficiaryWithLoanCount) / beneficiaryCount,
      beneficiaryMaleCountFraction:
        (beneficiaryCount - beneficiaryFemaleCount) / beneficiaryCount,
    },
    thisParish: {
      parishCount: 1,
      villageCount: _villageCount,
      groupCount: _groupCount,
      beneficiaryCount: _beneficiaryCount,
      beneficiaryWithLoanCount: _beneficiaryWithLoanCount,
      beneficiaryFemaleCount: _beneficiaryFemaleCount,
      beneficiaryWithoutLoanCount:
        _beneficiaryCount - _beneficiaryWithLoanCount,
      beneficiaryMaleCount: _beneficiaryCount - _beneficiaryFemaleCount,

      beneficiaryWithLoanCountFraction:
        _beneficiaryWithLoanCount / _beneficiaryCount,
      beneficiaryFemaleCountFraction:
        _beneficiaryFemaleCount / _beneficiaryCount,
      beneficiaryWithoutLoanCountFraction:
        (_beneficiaryCount - _beneficiaryWithLoanCount) / _beneficiaryCount,
      beneficiaryMaleCountFraction:
        (_beneficiaryCount - _beneficiaryFemaleCount) / _beneficiaryCount,
    },
  };
}
