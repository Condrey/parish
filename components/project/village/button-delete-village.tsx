"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { VillageData } from "@/lib/types";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { useDeleteVillageMutation } from "./mutation";

interface ButtonDeleteVillageProps extends ButtonProps {
  village: VillageData;
}

export default function ButtonDeleteVillage({
  village,
  variant,
  ...props
}: ButtonDeleteVillageProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.TECHNICAL_OFFICER);
  if (!isAuthorized) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant || "destructive"}
        {...props}
      />
      <DeleteVillageDialog open={open} setOpen={setOpen} village={village} />
    </>
  );
}

interface DeleteVillageDialogProps {
  village: VillageData;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function DeleteVillageDialog({
  village,
  open,
  setOpen,
}: DeleteVillageDialogProps) {
  const { mutate, isPending } = useDeleteVillageMutation();
  function handleDelete() {
    mutate(village.id, { onSuccess: () => setOpen(false) });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive ">
            <AlertTriangleIcon
              className="inline mr-2 size-10 fill-destructive/20 text-destructive  "
              strokeWidth={0.8}
            />
            <span className="uppercase">Delete {village.name} village</span>
          </DialogTitle>
          <DialogDescription>
            Dangerous! Please note that this action is irreversible
          </DialogDescription>
        </DialogHeader>
        <p>
          This will delete <strong>{village.name}</strong> and all its{" "}
          <strong>Sacco Groups</strong> from the database. Continue with
          caution.
        </p>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            Continue
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
