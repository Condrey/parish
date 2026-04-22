"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { ParishData } from "@/lib/types";
import { useState } from "react";
import FormAddEditParish from "./form-add-edit-parish";

interface ButtonAddEditParishProps extends ButtonProps {
  parish?: ParishData;
  subCountyId?: string;
}
export default function ButtonAddEditParish({
  parish,
  subCountyId,
  ...props
}: ButtonAddEditParishProps) {
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
          parish
            ? `Update ${parish.name} parish's value`
            : "Create a new parish"
        }
        {...props}
      />
      <FormAddEditParish
        open={open}
        setOpen={setOpen}
        parishToEdit={parish}
        subCountyId={subCountyId}
      />
    </>
  );
}
