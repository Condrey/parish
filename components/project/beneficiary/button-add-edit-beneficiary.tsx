"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { BeneficiaryData } from "@/lib/types";
import { useState } from "react";
import FormAddEditBeneficiary from "./form-add-edit-beneficiary";

interface ButtonAddEditBeneficiaryProps extends ButtonProps {
  beneficiary?: BeneficiaryData;
  saccoGroupId?: string;
}
export default function ButtonAddEditBeneficiary({
  beneficiary,
  saccoGroupId,
  ...props
}: ButtonAddEditBeneficiaryProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return null;
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        title={
          beneficiary
            ? `Update ${beneficiary.fullName} beneficiary's value`
            : "Create a new beneficiary"
        }
        {...props}
      />
      <FormAddEditBeneficiary
        open={open}
        setOpen={setOpen}
        beneficiaryToEdit={beneficiary}
        saccoGroupId={saccoGroupId}
      />
    </>
  );
}
