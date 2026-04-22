"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { SaccoGroupData } from "@/lib/types";
import { useState } from "react";
import FormAddEditSaccoGroup from "./form-add-edit-sacco-group";

interface ButtonAddEditSaccoGroupProps extends ButtonProps {
  saccoGroup?: SaccoGroupData;
  villageId?: string;
}
export default function ButtonAddEditSaccoGroup({
  saccoGroup,
  villageId,
  ...props
}: ButtonAddEditSaccoGroupProps) {
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
          saccoGroup
            ? `Update ${saccoGroup.name} Sacco Group's value`
            : "Create a new Sacco Group"
        }
        {...props}
      />
      <FormAddEditSaccoGroup
        open={open}
        setOpen={setOpen}
        saccoGroupToEdit={saccoGroup}
        villageId={villageId}
      />
    </>
  );
}
