/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { Gender, Role, Status } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { beneficiaryDataInclude } from "@/lib/types";
import {
  beneficiarySchema,
  BeneficiarySchema,
  BulkBeneficiaryUploadArray,
  bulkBeneficiaryUploadArraySchema,
} from "@/lib/validation";
import { cache } from "react";
import { getSaccoGroupById } from "../sacco-group/action";

const saccoGroupEnumDataInclude = {
  village: {
    include: {
      parish: { include: { subCounty: { include: { district: true } } } },
    },
  },
} satisfies Prisma.SaccoGroupInclude;
export type SaccoGroupEnumData = Prisma.SaccoGroupGetPayload<{
  include: typeof saccoGroupEnumDataInclude;
}>;
export async function getSaccoGroupEnums(): Promise<SaccoGroupEnumData[]> {
  return await prisma.saccoGroup.findMany({
    include: saccoGroupEnumDataInclude,
  });
}

async function allBeneficiaries() {
  return await prisma.beneficiary.findMany({
    include: beneficiaryDataInclude,
    orderBy: { fullName: "asc" },
  });
}
export const getAllBeneficiaries = cache(allBeneficiaries);

async function allBeneficiariesBySaccoGroupId(saccoGroupId: string) {
  const [beneficiaries, saccoGroup] = await Promise.all([
    await prisma.beneficiary.findMany({
      where: { saccoGroupId },
      include: beneficiaryDataInclude,
      orderBy: { fullName: "asc" },
    }),
    await getSaccoGroupById(saccoGroupId),
  ]);
  return { beneficiaries, saccoGroup };
}
export const getAllBeneficiariesBySaccoGroupId = cache(
  allBeneficiariesBySaccoGroupId,
);

async function beneficiaryById(id: string) {
  return await prisma.beneficiary.findUnique({
    where: { id },
    include: beneficiaryDataInclude,
  });
}
export const getBeneficiaryById = cache(beneficiaryById);

export async function upsertBeneficiary(formData: BeneficiarySchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  console.log({ formData });

  const {
    id,
    fullName,
    gender,
    memberId,
    saccoGroupId,
    status,
    contact,
    email,
    nin,
    subsistence,
  } = beneficiarySchema.parse(formData);
  const data = await prisma.beneficiary.upsert({
    where: { id },
    create: {
      fullName,
      gender,
      memberId,
      status,
      contact,
      email,
      nin,
      subsistence,
      saccoGroup: { connect: { id: saccoGroupId } },
    },
    update: {
      fullName,
      gender,
      memberId,
      status,
      contact,
      email,
      nin,
      subsistence,
      saccoGroup: { connect: { id: saccoGroupId } },
    },
    include: beneficiaryDataInclude,
  });
  return data;
}

export async function deleteBeneficiary(id: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return "Unauthorized!";
  return await prisma.beneficiary.delete({
    where: { id },
    include: beneficiaryDataInclude,
  });
}

const key = (...parts: (string | number)[]) =>
  parts.map((p) => String(p).trim().toLowerCase()).join("|");

const norm = (v: any) =>
  String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export async function createManyBeneficiariesOptimized({
  beneficiaries: _beneficiaries,
  districtId,
}: {
  beneficiaries: BulkBeneficiaryUploadArray;
  districtId: string;
}) {
  const { beneficiaries } =
    bulkBeneficiaryUploadArraySchema.parse(_beneficiaries);

  return await prisma.$transaction(async (tx) => {
    // =========================
    // 1. BUILD UNIQUE STRUCTURE
    // =========================

    const subCountySet = new Map<string, { name: string }>();
    const parishSet = new Map<string, { name: string; subCountyKey: string }>();
    const villageSet = new Map<string, { name: string; parishKey: string }>();
    const groupSet = new Map<string, { name: string; villageKey: string }>();

    for (const b of beneficiaries) {
      const scKey = key(norm(b.subCounty), districtId);
      const pKey = key(norm(b.parish), scKey);
      const vKey = key(norm(b.village), pKey);
      const gKey = key(norm(b.enterpriseGroupName), vKey);

      subCountySet.set(scKey, { name: norm(b.subCounty) });
      parishSet.set(pKey, { name: norm(b.parish), subCountyKey: scKey });
      villageSet.set(vKey, { name: norm(b.village), parishKey: pKey });
      groupSet.set(gKey, {
        name: norm(b.enterpriseGroupName),
        villageKey: vKey,
      });
    }

    // =========================
    // 2. SUBCOUNTY
    // =========================
    await tx.subCounty.createMany({
      data: [...subCountySet.entries()].map(([key, v]) => ({
        name: v.name,
        districtId,
        // _key: key, // optional debugging field (if you add it in schema)
      })),
      skipDuplicates: true,
    });

    const subCounties = await tx.subCounty.findMany({ where: { districtId } });

    const subCountyMap = new Map<string, string>();
    for (const sc of subCounties) {
      const scKey = key(sc.name, districtId);
      subCountyMap.set(scKey, sc.id);
    }

    // =========================
    // 3. PARISH
    // =========================
    const parishData = [...parishSet.entries()].map(([pKey, v]) => ({
      name: v.name,
      subCountyId: subCountyMap.get(v.subCountyKey),
    }));

    await tx.parish.createMany({
      data: parishData.filter((p) => p.subCountyId),
      skipDuplicates: true,
    });

    const parishes = await tx.parish.findMany();

    const parishMap = new Map<string, string>();
    for (const p of parishes) {
      const sc = subCounties.find((s) => s.id === p.subCountyId);
      if (!sc) continue;

      const pKey = key(p.name, key(sc.name, districtId));
      parishMap.set(pKey, p.id);
    }

    // =========================
    // 4. VILLAGE
    // =========================
    const villageData = [...villageSet.entries()].map(([vKey, v]) => ({
      name: v.name,
      parishId: parishMap.get(v.parishKey),
    }));

    await tx.village.createMany({
      data: villageData.filter((v) => v.parishId),
      skipDuplicates: true,
    });

    const villages = await tx.village.findMany();

    const villageMap = new Map<string, string>();
    for (const v of villages) {
      const parish = parishes.find((p) => p.id === v.parishId);
      const sc = subCounties.find((s) => s.id === parish?.subCountyId);

      if (!parish || !sc) continue;

      const vKey = key(v.name, key(parish.name, key(sc.name, districtId)));
      villageMap.set(vKey, v.id);
    }

    // =========================
    // 5. GROUP
    // =========================
    const groupData = [...groupSet.entries()].map(([gKey, g]) => ({
      name: g.name,
      villageId: villageMap.get(g.villageKey),
    }));

    await tx.saccoGroup.createMany({
      data: groupData.filter((g) => g.villageId),
      skipDuplicates: true,
    });

    const groups = await tx.saccoGroup.findMany();

    const groupMap = new Map<string, string>();
    for (const g of groups) {
      const village = villages.find((v) => v.id === g.villageId);
      const parish = parishes.find((p) => p.id === village?.parishId);
      const sc = subCounties.find((s) => s.id === parish?.subCountyId);

      if (!village || !parish || !sc) continue;

      const gKey = key(
        g.name,
        key(village.name, key(parish.name, key(sc.name, districtId))),
      );

      groupMap.set(gKey, g.id);
    }

    // =========================
    // 6. BENEFICIARIES
    // =========================
    const beneficiaryData = [];

    for (const b of beneficiaries) {
      const scKey = key(norm(b.subCounty), districtId);
      const pKey = key(norm(b.parish), scKey);
      const vKey = key(norm(b.village), pKey);
      const gKey = key(norm(b.enterpriseGroupName), vKey);

      const groupId = groupMap.get(gKey);

      if (!groupId) {
        console.log("FAILED ROW:", {
          group: b.enterpriseGroupName,
          village: b.village,
          parish: b.parish,
          subCounty: b.subCounty,
          computedKey: gKey,
        });
        continue; // skip bad row instead of crashing entire batch
      }

      beneficiaryData.push({
        nin: b.nin,
        fullName: b.fullname,
        gender: b.gender === "F" ? Gender.FEMALE : Gender.MALE,
        status: b.status === "Active" ? Status.ACTIVE : Status.INACTIVE,
        memberId: b.memberId,
        email: b.email || `${crypto.randomUUID()}@go.ug`,
        contact: b.contact,
        subsistence: b.subsistence,
        saccoGroupId: groupId,
      });
    }

    console.log("TOTAL BENEFICIARIES INPUT:", beneficiaries.length);
    console.log("VALID BENEFICIARIES OUTPUT:", beneficiaryData.length);
    console.log("SAMPLE OUTPUT:", beneficiaryData.slice(0, 3));

    await tx.beneficiary.createMany({
      data: beneficiaryData,
      skipDuplicates: true,
    });

    return {
      success: true,
      inserted: beneficiaryData.length,
      groups: groupSet.size,
      villages: villageSet.size,
      parishes: parishSet.size,
      subCounties: subCountySet.size,
    };
  });
}
