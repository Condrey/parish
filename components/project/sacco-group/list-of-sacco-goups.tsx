"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { SaccoGroupData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllSaccoGroups } from "./action";
import ButtonAddEditSaccoGroup from "./button-add-edit-sacco-group";
import { useSaccoGroupColumns } from "./columns";

export default function ListOfSaccoGroups({
  initialData,
}: {
  initialData: SaccoGroupData[];
}) {
  const query = useQuery({
    queryKey: ["saccoGroups"],
    queryFn: getAllSaccoGroups,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch Sacco Groups. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No Sacco Group available"
        description="There are no Sacco Groups in the database yet."
      >
        <ButtonAddEditSaccoGroup variant={"secondary"}>
          Add SaccoGroup
        </ButtonAddEditSaccoGroup>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useSaccoGroupColumns}
      data={data}
      filterColumn={{ id: "name" }}
      className="w-full"
    >
      <ButtonAddEditSaccoGroup>
        <PlusIcon />
      </ButtonAddEditSaccoGroup>
    </DataTable>
  );
}
