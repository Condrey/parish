"use client";

import { DataTable } from "@/components/data-table/data-table";
import ButtonAddEditSaccoGroup from "@/components/project/sacco-group/button-add-edit-sacco-group";
import { useSaccoGroupColumns } from "@/components/project/sacco-group/columns";
import { TypographyH2 } from "@/components/project/typography";
import { getVillageById } from "@/components/project/village/action";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { VillageData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

export default function PageClient({
  initialData,
  villageId,
}: {
  initialData: VillageData;
  villageId: string;
}) {
  const query = useQuery({
    queryKey: ["village", villageId],
    queryFn: getVillageById.bind(undefined, villageId),
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch village details. Please try again."
      />
    );
  }
  if (!data) {
    return (
      <EmptyContainer
        title="Village not found"
        description="Either the village has been moved to another location or deleted."
      />
    );
  }
  const { name: villageName, parish, saccoGroups } = data;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return (
    <>
      {!saccoGroups.length ? (
        <EmptyContainer
          title="Sacco groups missing"
          description="All the added sacco groups shall appear here."
        >
          <ButtonAddEditSaccoGroup villageId={villageId} variant={"secondary"}>
            Add SaccoGroup
          </ButtonAddEditSaccoGroup>
        </EmptyContainer>
      ) : (
        <DataTable
          data={saccoGroups}
          columns={useSaccoGroupColumns}
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
              <TypographyH2>
                List of SaccoGroups in {villageName}, {parishName},{" "}
                {subCountyName}
              </TypographyH2>
            </div>
          }
          className="w-full"
        >
          <ButtonAddEditSaccoGroup size={"icon-sm"} villageId={villageId}>
            <PlusIcon />
          </ButtonAddEditSaccoGroup>
        </DataTable>
      )}
    </>
  );
}
