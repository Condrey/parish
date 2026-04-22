import BodyContainer from "@/components/home/body-container";
import { getAllBeneficiariesBySaccoGroupId } from "@/components/project/beneficiary/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ saccoGroupId: string }>;
}
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { saccoGroupId: encSaccoGroupId } = await params;
  const saccoGroupId = decodeURIComponent(encSaccoGroupId);
  const { saccoGroup } = await getAllBeneficiariesBySaccoGroupId(saccoGroupId);
  if (!saccoGroup) {
    return {
      title: "Sacco Group not found",
      description:
        "Either the Sacco Group has been moved to another location or deleted.",
    };
  }
  const { name: saccoGroupName, village } = saccoGroup;
  const { name: villageName, parish } = village!;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return {
    title: `${saccoGroupName} | ${voteNumber}: ${name}`,
    description: `One of the Sacco Groups found in ${villageName} of ${parishName} in ${subCountyName} sub-county, ${voteNumber}, vote ${name}, located at ${votePhysicalAddress}, ${votePostalAddress}`,
  };
};
export default async function Page({ params }: Props) {
  const { saccoGroupId: encSaccoGroupId } = await params;
  const saccoGroupId = decodeURIComponent(encSaccoGroupId);
  const { saccoGroup, beneficiaries } =
    await getAllBeneficiariesBySaccoGroupId(saccoGroupId);
  if (!saccoGroup) {
    return notFound();
  }
  const { name: saccoGroupName, village, villageId } = saccoGroup;
  const { name: villageName, parish, parishId } = village!;
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
        {
          title: `${villageName}`,
          href: `/district/${districtId}/sub-county/${subCountyId}/parish/${parishId}/village/${villageId}`,
        },
        { title: `${saccoGroupName}` },
      ]}
      className="space-y-6"
    >
      <PageClient
        data={{ saccoGroup, beneficiaries }}
        saccoGroupId={saccoGroupId}
      />
    </BodyContainer>
  );
}
