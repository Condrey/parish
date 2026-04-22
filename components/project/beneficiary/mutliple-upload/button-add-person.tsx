"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormAddEditPerson from "./form-add-edit-person";
import { BulkBeneficiaryUploadArray } from "@/lib/validation";

interface ButtonAddPersonProps extends ButtonProps {
  formValue: UseFormReturn<BulkBeneficiaryUploadArray>;
}

export default function ButtonAddPerson({
  formValue,
  ...props
}: ButtonAddPersonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        title={"Create new person"}
        {...props}
      />

      <FormAddEditPerson open={open} setOpen={setOpen} form={formValue} />
    </>
  );
}
