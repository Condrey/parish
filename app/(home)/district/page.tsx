import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import BodyContainer from "@/components/home/body-container";
import { getAllDistricts } from "@/components/project/district/action";
import ListOfDistricts from "@/components/project/district/list-of-districts";
import { TypographyH1 } from "@/components/project/typography";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "District/City lists",
  description:
    "List of all Districts/Cities in the country that are registered in the system",
};
export default async function Page() {
  const allDistricts = getAllDistricts();
  return (
    <BodyContainer
      breadCrumbs={[{ title: "District/City lists", href: "/district" }]}
      className="space-y-6"
    >
      <TypographyH1 className="">Please select a District</TypographyH1>
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        {allDistricts.then((districts) => (
          <ListOfDistricts initialData={districts} />
        ))}
      </Suspense>
    </BodyContainer>
  );
}
