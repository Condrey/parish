import BodyContainer from "@/components/home/body-container";
import { getSubCountyById } from "@/components/project/sub-county/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ subCountyId: string }>;
}
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { subCountyId: encSubCountyId } = await params;
  const subCountyId = decodeURIComponent(encSubCountyId);
  const subCounty = await getSubCountyById(subCountyId);
  if (!subCounty) {
    return {
      title: "SubCounty not found",
      description:
        "Either the subCounty has been moved to another location or deleted.",
    };
  }
  const { name: subCountyName, district } = subCounty;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return {
    title: `${subCountyName} | ${voteNumber}: ${name}`,
    description: `One of the sub counties of ${voteNumber}: ${name}, located at ${votePhysicalAddress}, ${votePostalAddress}`,
  };
};
export default async function Page({ params }: Props) {
  const { subCountyId: encSubCountyId } = await params;
  const subCountyId = decodeURIComponent(encSubCountyId);
  const subCounty = await getSubCountyById(subCountyId);
  if (!subCounty) {
    notFound();
  }
  const { name: subCountyName, district } = subCounty;
  const { name, voteNumber, id } = district!;
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "All district/ City lists", href: "/district" },
        { title: `${voteNumber}: ${name}`, href: `/district/${id}` },
        { title: `${subCountyName}` },
      ]}
      className="space-y-6"
    >
      <PageClient initialData={subCounty} subCountyId={subCountyId} />
    </BodyContainer>
  );
}
