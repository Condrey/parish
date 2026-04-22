"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { VillageData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllVillages } from "./action";
import ButtonAddEditVillage from "./button-add-edit-village";
import { useVillageColumns } from "./columns";

export default function ListOfVillages({
  initialData,
}: {
  initialData: VillageData[];
}) {
  const query = useQuery({
    queryKey: ["villages"],
    queryFn: getAllVillages,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch villages. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No village available"
        description="There are no villages in the database yet."
      >
        <ButtonAddEditVillage variant={"secondary"}>
          Add Village
        </ButtonAddEditVillage>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useVillageColumns}
      data={data}
      filterColumn={{ id: "name" }}
      className="w-full"
    >
      <ButtonAddEditVillage>
        <PlusIcon />
      </ButtonAddEditVillage>
    </DataTable>
  );
}
