"use client";

import { DataTable } from "@/components/data-table/data-table";
import ButtonAddManyBeneficiaries from "@/components/project/beneficiary/mutliple-upload/button-add-many-beneficiaries";
import { getDistrictById } from "@/components/project/district/action";
import ButtonAddEditSubCounty from "@/components/project/sub-county/button-add-edit-sub-county";
import { useSubCountyColumns } from "@/components/project/sub-county/columns";
import { TypographyH2 } from "@/components/project/typography";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { DistrictData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, SheetIcon } from "lucide-react";

export default function PageClient({
  initialData,
  districtId,
}: {
  initialData: DistrictData;
  districtId: string;
}) {
  const query = useQuery({
    queryKey: ["district", districtId],
    queryFn: getDistrictById.bind(undefined, districtId),
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch district details. Please try again."
      />
    );
  }
  if (!data) {
    return (
      <EmptyContainer
        title="District not found"
        description="Either the district has been moved to another location or deleted."
      />
    );
  }
  const {
    subCounties,
    name,
    voteNumber,
    votePhysicalAddress,
    votePostalAddress,
  } = data;
  return (
    <>
      {!subCounties.length ? (
        <EmptyContainer
          title="Sub-counties missing"
          description="All the added sub-counties shall appear here."
        >
          <ButtonAddEditSubCounty districtId={districtId} variant={"secondary"}>
            Add Sub county
          </ButtonAddEditSubCounty>
        </EmptyContainer>
      ) : (
        <DataTable
          data={subCounties}
          columns={useSubCountyColumns}
          filterColumn={{ id: "name" }}
          tableHeaderSection={
            <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
              <div>
                <CardTitle>
                  {voteNumber}: {name}
                </CardTitle>
                <CardDescription>{votePostalAddress}</CardDescription>
                <CardDescription>{votePhysicalAddress}</CardDescription>
              </div>
              <TypographyH2>List of Sub-counties</TypographyH2>
            </div>
          }
          className="w-full"
        >
          <ButtonAddManyBeneficiaries
            district={data}
            size={"icon-sm"}
            variant={"secondary"}
          >
            <SheetIcon />
          </ButtonAddManyBeneficiaries>
          <ButtonAddEditSubCounty size={"icon-sm"} districtId={districtId}>
            <PlusIcon />
          </ButtonAddEditSubCounty>
        </DataTable>
      )}
    </>
  );
}
