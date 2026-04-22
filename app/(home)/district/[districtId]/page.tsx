import BodyContainer from "@/components/home/body-container";
import { getDistrictById } from "@/components/project/district/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ districtId: string }>;
}
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { districtId: encDistrictId } = await params;
  const districtId = decodeURIComponent(encDistrictId);
  const district = await getDistrictById(districtId);
  if (!district) {
    return {
      title: "District not found",
      description:
        "Either the district has been moved to another location or deleted.",
    };
  }
  const { name, votePhysicalAddress, voteNumber, votePostalAddress } = district;
  return {
    title: `${voteNumber}: ${name}`,
    description: `Located at ${votePhysicalAddress}, ${votePostalAddress}`,
  };
};
export default async function Page({ params }: Props) {
  const { districtId: encDistrictId } = await params;
  const districtId = decodeURIComponent(encDistrictId);
  const district = await getDistrictById(districtId);
  if (!district) {
    notFound();
  }
  const { voteNumber, name } = district;
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "All district/City lists", href: "/district" },
        { title: `${voteNumber}: ${name}` },
      ]}
      className="space-y-6"
    >
      <PageClient initialData={district} districtId={districtId} />
    </BodyContainer>
  );
}
