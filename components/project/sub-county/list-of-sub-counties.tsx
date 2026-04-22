"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { SubCountyData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllSubCounties } from "./action";
import ButtonAddEditSubCounty from "./button-add-edit-sub-county";
import { useSubCountyColumns } from "./columns";

export default function ListOfSubCounties({
  initialData,
}: {
  initialData: SubCountyData[];
}) {
  const query = useQuery({
    queryKey: ["subCounties"],
    queryFn: getAllSubCounties,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch subCounties. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No subCounty available"
        description="There are no subCounties in the database yet."
      >
        <ButtonAddEditSubCounty variant={"secondary"}>
          Add SubCounty
        </ButtonAddEditSubCounty>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useSubCountyColumns}
      data={data}
      filterColumn={{ id: "name" }}
      className="w-full"
    >
      <ButtonAddEditSubCounty>
        <PlusIcon />
      </ButtonAddEditSubCounty>
    </DataTable>
  );
}
