import BodyContainer from "@/components/home/body-container";
import { getParishById } from "@/components/project/parish/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ parishId: string }>;
}
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { parishId: encParishId } = await params;
  const parishId = decodeURIComponent(encParishId);
  const parish = await getParishById(parishId);
  if (!parish) {
    return {
      title: "Parish not found",
      description:
        "Either the parish has been moved to another location or deleted.",
    };
  }
  const { name: parishName, subCounty } = parish;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return {
    title: `${parishName} | ${voteNumber}: ${name}`,
    description: `One of the parishes of ${subCountyName}, ${voteNumber}, vote ${name}, located at ${votePhysicalAddress}, ${votePostalAddress}`,
  };
};
export default async function Page({ params }: Props) {
  const { parishId: encParishId } = await params;
  const parishId = decodeURIComponent(encParishId);
  const parish = await getParishById(parishId);
  if (!parish) {
    notFound();
  }
  const { name: parishName, subCounty } = parish;
  const { name: subCountyName, district, id: subCountyId } = subCounty!;
  const { voteNumber, name, id: districtId } = district!;
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "All district/ City lists", href: "/district" },
        { title: `${voteNumber}: ${name}`, href: `/district/${districtId}/` },
        {
          title: `${subCountyName}`,
          href: `/district/${districtId}/sub-county/${subCountyId}`,
        },
        { title: `${parishName}` },
      ]}
      className="space-y-6"
    >
      {/* <pre>{JSON.stringify(parish, null, 2)}</pre> */}
      <PageClient initialData={parish} parishId={parishId} />
    </BodyContainer>
  );
}
