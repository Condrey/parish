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
import { BeneficiaryData } from "@/lib/types";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { useDeleteBeneficiaryMutation } from "./mutation";

interface ButtonDeleteBeneficiaryProps extends ButtonProps {
  beneficiary: BeneficiaryData;
}

export default function ButtonDeleteBeneficiary({
  beneficiary,
  variant,
  ...props
}: ButtonDeleteBeneficiaryProps) {
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
      <DeleteBeneficiaryDialog
        open={open}
        setOpen={setOpen}
        beneficiary={beneficiary}
      />
    </>
  );
}

interface DeleteBeneficiaryDialogProps {
  beneficiary: BeneficiaryData;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function DeleteBeneficiaryDialog({
  beneficiary,
  open,
  setOpen,
}: DeleteBeneficiaryDialogProps) {
  const { mutate, isPending } = useDeleteBeneficiaryMutation();
  function handleDelete() {
    mutate(beneficiary.id, { onSuccess: () => setOpen(false) });
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
            <span className="uppercase">
              Delete {beneficiary.fullName} beneficiary
            </span>
          </DialogTitle>
          <DialogDescription>
            Dangerous! Please note that this action is irreversible
          </DialogDescription>
        </DialogHeader>
        <p>
          This will delete all beneficiary&{" "}
          <strong>{beneficiary.fullName}</strong> and all their information from
          the database. Continue with caution.
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
