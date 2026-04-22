"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { ParishData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllParishes } from "./action";
import ButtonAddEditParish from "./button-add-edit-parish";
import { useParishColumns } from "./columns";

export default function ListOfParishes({
  initialData,
}: {
  initialData: ParishData[];
}) {
  const query = useQuery({
    queryKey: ["parishes"],
    queryFn: getAllParishes,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch parishes. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No parish available"
        description="There are no parishes in the database yet."
      >
        <ButtonAddEditParish variant={"secondary"}>
          Add Parish
        </ButtonAddEditParish>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useParishColumns}
      data={data}
      filterColumn={{ id: "name" }}
      className="w-full"
    >
      <ButtonAddEditParish>
        <PlusIcon />
      </ButtonAddEditParish>
    </DataTable>
  );
}
