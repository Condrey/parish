"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { District } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormAddManyBeneficiaries } from "./form-add-many-beneficiaries";

interface ButtonAddManyBeneficiariesProps extends ButtonProps {
  district: District;
}

export default function ButtonAddManyBeneficiaries({
  district,
  className,
  ...props
}: ButtonAddManyBeneficiariesProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        title={"Create many staffs"}
        className={cn(
          "bg-green-700 text-white hover:bg-green-700/50",
          className,
        )}
        {...props}
      />
      <FormAddManyBeneficiaries
        open={open}
        setOpen={setOpen}
        district={district}
      />
    </>
  );
}
