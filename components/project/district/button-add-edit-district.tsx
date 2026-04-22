"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { DistrictData } from "@/lib/types";
import { useState } from "react";
import FormAddEditDistrict from "./form-add-edit-district";

interface ButtonAddEditDistrictProps extends ButtonProps {
  district?: DistrictData;
}
export default function ButtonAddEditDistrict({
  district,
  ...props
}: ButtonAddEditDistrictProps) {
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
          district
            ? `Update ${district.name} district's value`
            : "Create a new district"
        }
        {...props}
      />
      <FormAddEditDistrict
        open={open}
        setOpen={setOpen}
        districtToEdit={district}
      />
    </>
  );
}
