import { Prisma } from "./generated/prisma/client";

export const beneficiaryDataInclude = {
  saccoGroup: {
    include: {
      village: {
        include: {
          parish: { include: { subCounty: { include: { district: true } } } },
        },
      },
    },
  },
} satisfies Prisma.BeneficiaryInclude;
export type BeneficiaryData = Prisma.BeneficiaryGetPayload<{
  include: typeof beneficiaryDataInclude;
}>;

export const saccoGroupDataInclude = {
  village: {
    include: {
      parish: { include: { subCounty: { include: { district: true } } } },
    },
  },
  beneficiaries: { orderBy: { fullName: "asc" } },
  _count: { select: { beneficiaries: true } },
} satisfies Prisma.SaccoGroupInclude;
export type SaccoGroupData = Prisma.SaccoGroupGetPayload<{
  include: typeof saccoGroupDataInclude;
}>;

export const villageDataInclude = {
  parish: { include: { subCounty: { include: { district: true } } } },
  _count: { select: { saccoGroups: true } },
  saccoGroups: {
    include: saccoGroupDataInclude,
    orderBy: { name: "asc" },
  },
} satisfies Prisma.VillageInclude;
export type VillageData = Prisma.VillageGetPayload<{
  include: typeof villageDataInclude;
}>;

export const parishDataInclude = {
  subCounty: {
    include: {
      district: { include: { officers: { select: { user: true } } } },
    },
  },
  _count: { select: { villages: true } },
  villages: {
    include: villageDataInclude,
    orderBy: { name: "asc" },
  },
} satisfies Prisma.ParishInclude;
export type ParishData = Prisma.ParishGetPayload<{
  include: typeof parishDataInclude;
}>;

export const subCountyDataInclude = {
  district: true,
  _count: { select: { parishes: true } },
  parishes: {
    include: parishDataInclude,
  },
} satisfies Prisma.SubCountyInclude;
export type SubCountyData = Prisma.SubCountyGetPayload<{
  include: typeof subCountyDataInclude;
}>;

export const districtDataInclude = {
  _count: { select: { subCounties: true } },
  subCounties: {
    include: subCountyDataInclude,
    orderBy: { name: "asc" },
  },
} satisfies Prisma.DistrictInclude;
export type DistrictData = Prisma.DistrictGetPayload<{
  include: typeof districtDataInclude;
}>;
