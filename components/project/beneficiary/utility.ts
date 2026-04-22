"use server";

import prisma from "@/lib/prisma";

// const districtCache = new Map<string, string>();
const subCountyCache = new Map<string, string>();
const parishCache = new Map<string, string>();
const villageCache = new Map<string, string>();
const groupCache = new Map<string, string>();

// async function getDistrictId(name: string) {
//   if (districtCache.has(name)) return districtCache.get(name)!;
//   const d = await prisma.district.upsert({
//     where: { name, },
//     create: { name ,voteNumber:'',votePhysicalAddress:'',votePostalAddress:'',},
//     update: {},
//   });

//   districtCache.set(name, d.id);
//   return d.id;
// }

export async function getSubCountyId(name: string, districtId: string) {
  const key = `${name}-${districtId}`;
  if (subCountyCache.has(key)) return subCountyCache.get(key)!;

  const sc = await prisma.subCounty.upsert({
    where: { name_districtId: { name, districtId } },
    create: { name, districtId },
    update: {},
  });

  subCountyCache.set(key, sc.id);
  return sc.id;
}

export async function getParishId(name: string, subCountyId: string) {
  const key = `${name}-${subCountyId}`;
  if (parishCache.has(key)) return parishCache.get(key)!;

  const p = await prisma.parish.upsert({
    where: { name_subCountyId: { name, subCountyId } },
    create: { name, subCountyId },
    update: {},
  });

  parishCache.set(key, p.id);
  return p.id;
}

export async function getVillageId(name: string, parishId: string) {
  const key = `${name}-${parishId}`;
  if (villageCache.has(key)) return villageCache.get(key)!;

  const v = await prisma.village.upsert({
    where: { name_parishId: { name, parishId } },
    create: { name, parishId },
    update: {},
  });

  villageCache.set(key, v.id);
  return v.id;
}

export async function getGroupId(name: string, villageId: string) {
  const key = `${name}-${villageId}`;
  if (groupCache.has(key)) return groupCache.get(key)!;

  const g = await prisma.saccoGroup.upsert({
    where: { name_villageId: { name, villageId } },
    create: { name, villageId },
    update: {},
  });

  groupCache.set(key, g.id);
  return g.id;
}
