"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { DistrictData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllDistricts } from "./action";
import ButtonAddEditDistrict from "./button-add-edit-district";
import { useDistrictColumns } from "./columns";

export default function ListOfDistricts({
  initialData,
}: {
  initialData: DistrictData[];
}) {
  const query = useQuery({
    queryKey: ["districts"],
    queryFn: getAllDistricts,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch districts. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No district available"
        description="There are no districts in the database yet."
      >
        <ButtonAddEditDistrict variant={"secondary"}>
          Add District
        </ButtonAddEditDistrict>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useDistrictColumns}
      data={data}
      filterColumn={{ id: "name" }}
      className="w-full"
    >
      <ButtonAddEditDistrict>
        <PlusIcon />
      </ButtonAddEditDistrict>
    </DataTable>
  );
}
