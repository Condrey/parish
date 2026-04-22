"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { SubCountyData } from "@/lib/types";
import { useState } from "react";
import FormAddEditSubCounty from "./form-add-edit-sub-county";

interface ButtonAddEditSubCountyProps extends ButtonProps {
  subCounty?: SubCountyData;
  districtId?: string;
}
export default function ButtonAddEditSubCounty({
  subCounty,
  districtId,
  ...props
}: ButtonAddEditSubCountyProps) {
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
          subCounty
            ? `Update ${subCounty.name} subCounty's value`
            : "Create a new subCounty"
        }
        {...props}
      />
      <FormAddEditSubCounty
        open={open}
        setOpen={setOpen}
        subCountyToEdit={subCounty}
        districtId={districtId}
      />
    </>
  );
}
