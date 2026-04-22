"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { VillageData } from "@/lib/types";
import { useState } from "react";
import FormAddEditVillage from "./form-add-edit-village";

interface ButtonAddEditVillageProps extends ButtonProps {
  village?: VillageData;
  parishId?: string;
}
export default function ButtonAddEditVillage({
  village,
  parishId,
  ...props
}: ButtonAddEditVillageProps) {
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
          village
            ? `Update ${village.name} village's value`
            : "Create a new village"
        }
        {...props}
      />
      <FormAddEditVillage
        open={open}
        setOpen={setOpen}
        villageToEdit={village}
        parishId={parishId}
      />
    </>
  );
}
