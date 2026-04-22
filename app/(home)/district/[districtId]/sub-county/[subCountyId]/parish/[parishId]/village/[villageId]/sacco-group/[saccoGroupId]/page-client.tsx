"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getAllBeneficiariesBySaccoGroupId } from "@/components/project/beneficiary/action";
import ButtonAddEditBeneficiary from "@/components/project/beneficiary/button-add-edit-beneficiary";
import { useBeneficiaryColumns } from "@/components/project/beneficiary/columns";
import { TypographyH2 } from "@/components/project/typography";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { BeneficiaryData, SaccoGroupData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

export default function PageClient({
  data: initialData,
  saccoGroupId,
}: {
  data: { saccoGroup: SaccoGroupData; beneficiaries: BeneficiaryData[] };
  saccoGroupId: string;
}) {
  const query = useQuery({
    queryKey: ["beneficiaries", saccoGroupId],
    queryFn: getAllBeneficiariesBySaccoGroupId.bind(undefined, saccoGroupId),
    initialData,
  });
  const {
    status,
    data: { saccoGroup, beneficiaries },
  } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch beneficiary details. Please try again."
      />
    );
  }
  if (!saccoGroup) {
    return (
      <EmptyContainer
        title="Sacco Group not found"
        description="Either the Sacco Group have been moved to another location or deleted."
      />
    );
  }
  const { name: saccoGroupName, village } = saccoGroup;
  const { name: VillageName, parish } = village!;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { votePhysicalAddress, voteNumber, votePostalAddress, name } =
    district!;
  return (
    <>
      {!beneficiaries.length ? (
        <EmptyContainer
          title="Beneficiaries missing"
          description="All the added beneficiaries shall appear here."
        >
          <ButtonAddEditBeneficiary
            saccoGroupId={saccoGroupId}
            variant={"secondary"}
          >
            Add Beneficiary
          </ButtonAddEditBeneficiary>
        </EmptyContainer>
      ) : (
        <DataTable
          data={beneficiaries}
          columns={useBeneficiaryColumns}
          filterColumn={{ id: "fullName", label: "full name" }}
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
                List of Beneficiaries of {saccoGroupName} in {VillageName},{" "}
                {parishName}, {subCountyName}
              </TypographyH2>
            </div>
          }
          className="w-full"
        >
          <ButtonAddEditBeneficiary
            size={"icon-sm"}
            saccoGroupId={saccoGroupId}
          >
            <PlusIcon />
          </ButtonAddEditBeneficiary>
        </DataTable>
      )}
    </>
  );
}
