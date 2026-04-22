"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { BeneficiaryData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllBeneficiaries } from "./action";
import ButtonAddEditBeneficiary from "./button-add-edit-beneficiary";
import { useBeneficiaryColumns } from "./columns";

export default function ListOfBeneficiaries({
  initialData,
}: {
  initialData: BeneficiaryData[];
}) {
  const query = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: getAllBeneficiaries,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch beneficiaries. Please try again."
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyContainer
        title="No beneficiary available"
        description="There are no beneficiaries in the database yet."
      >
        <ButtonAddEditBeneficiary variant={"secondary"}>
          Add Beneficiary
        </ButtonAddEditBeneficiary>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      columns={useBeneficiaryColumns}
      data={data}
      filterColumn={{ id: "fullName" }}
      className="w-full"
    >
      <ButtonAddEditBeneficiary>
        <PlusIcon />
      </ButtonAddEditBeneficiary>
    </DataTable>
  );
}
