"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getParishById } from "@/components/project/parish/action";
import { DownloadParishExtractButton } from "@/components/project/parish/download-bsc-button";
import { TypographyH2 } from "@/components/project/typography";
import ButtonAddEditVillage from "@/components/project/village/button-add-edit-village";
import { useVillageColumns } from "@/components/project/village/columns";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ParishData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { DownloadCloudIcon, PlusIcon } from "lucide-react";

export default function PageClient({
  initialData,
  parishId,
}: {
  initialData: ParishData;
  parishId: string;
}) {
  const query = useQuery({
    queryKey: ["parish", parishId],
    queryFn: async () => getParishById(parishId),
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch parish details. Please try again."
      />
    );
  }
  if (!data) {
    return (
      <EmptyContainer
        title="Parish not found"
        description="Either the parish has been moved to another location or deleted."
      />
    );
  }
  const { name: parishName, subCounty, villages } = data;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return (
    <>
      {!villages.length ? (
        <EmptyContainer
          title="Villages missing"
          description="All the added villages shall appear here."
        >
          <ButtonAddEditVillage parishId={parishId} variant={"secondary"}>
            Add Village
          </ButtonAddEditVillage>
        </EmptyContainer>
      ) : (
        <DataTable
          data={villages}
          columns={useVillageColumns}
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
                List of Villages in {parishName}, {subCountyName}
              </TypographyH2>
            </div>
          }
          className="w-full"
        >
          <DownloadParishExtractButton
            size={"sm"}
            parish={data}
            variant={"destructive"}
          >
            <DownloadCloudIcon />
          </DownloadParishExtractButton>
          <ButtonAddEditVillage size={"icon-sm"} parishId={parishId}>
            <PlusIcon />
          </ButtonAddEditVillage>
        </DataTable>
      )}
    </>
  );
}
