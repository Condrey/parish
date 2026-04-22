"use client";

import { DataTable } from "@/components/data-table/data-table";
import ButtonAddEditParish from "@/components/project/parish/button-add-edit-parish";
import { useParishColumns } from "@/components/project/parish/columns";
import { getSubCountyById } from "@/components/project/sub-county/action";
import { TypographyH2 } from "@/components/project/typography";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { SubCountyData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

export default function PageClient({
  initialData,
  subCountyId,
}: {
  initialData: SubCountyData;
  subCountyId: string;
}) {
  const query = useQuery({
    queryKey: ["subCounty", subCountyId],
    queryFn: getSubCountyById.bind(undefined, subCountyId),
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch subCounty details. Please try again."
      />
    );
  }
  if (!data) {
    return (
      <EmptyContainer
        title="SubCounty not found"
        description="Either the subCounty has been moved to another location or deleted."
      />
    );
  }
  const { district, name: subCOuntyName, parishes } = data;
  const { name, voteNumber, votePhysicalAddress, votePostalAddress } =
    district!;
  return (
    <>
      {!parishes.length ? (
        <EmptyContainer
          title="Parishes missing"
          description="All the added parishes shall appear here."
        >
          <ButtonAddEditParish subCountyId={subCountyId} variant={"secondary"}>
            Add Parish
          </ButtonAddEditParish>
        </EmptyContainer>
      ) : (
        <DataTable
          data={parishes}
          columns={useParishColumns}
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
              <TypographyH2>List of Parishes in {subCOuntyName}</TypographyH2>
            </div>
          }
          className="w-full"
        >
          <ButtonAddEditParish size={"icon-sm"} subCountyId={subCountyId}>
            <PlusIcon />
          </ButtonAddEditParish>
        </DataTable>
      )}
    </>
  );
}
