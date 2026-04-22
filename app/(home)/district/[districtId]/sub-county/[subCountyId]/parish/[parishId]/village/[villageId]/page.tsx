import BodyContainer from "@/components/home/body-container";
import { getVillageById } from "@/components/project/village/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ villageId: string }>;
}
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { villageId: encVillageId } = await params;
  const villageId = decodeURIComponent(encVillageId);
  const village = await getVillageById(villageId);
  if (!village) {
    return {
      title: "Village not found",
      description:
        "Either the village has been moved to another location or deleted.",
    };
  }
  const { name: villageName, parish } = village;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return {
    title: `${villageName} | ${voteNumber}: ${name}`,
    description: `One of the villages of ${parishName} in ${subCountyName} sub-county, ${voteNumber}, vote ${name}, located at ${votePhysicalAddress}, ${votePostalAddress}`,
  };
};
export default async function Page({ params }: Props) {
  const { villageId: encVillageId } = await params;
  const villageId = decodeURIComponent(encVillageId);
  const village = await getVillageById(villageId);
  if (!village) {
    notFound();
  }
  const { name: villageName, parish, parishId } = village;
  const { name: parishName, subCounty, subCountyId } = parish!;
  const { name: subCountyName, district, districtId } = subCounty!;
  const { voteNumber, name } = district!;
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "All district/ City lists", href: "/district" },
        { title: `${voteNumber}: ${name}`, href: `/district/${districtId}/` },
        {
          title: `${subCountyName}`,
          href: `/district/${districtId}/sub-county/${subCountyId}`,
        },
        {
          title: `${parishName}`,
          href: `/district/${districtId}/sub-county/${subCountyId}/parish/${parishId}`,
        },
        { title: `${villageName}` },
      ]}
      className="space-y-6"
    >
      <PageClient initialData={village} villageId={villageId} />
    </BodyContainer>
  );
}
