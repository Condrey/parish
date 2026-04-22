"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createManyBeneficiariesOptimized,
  deleteBeneficiary,
  upsertBeneficiary,
} from "./action";

const queryKey: QueryKey = ["beneficiaries"];

export function useUpsertBeneficiaryMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertBeneficiary,
    onSuccess: async (data, variables) => {
      const queryKey2 = ["saccoGroup", variables.saccoGroupId];
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
      ]);
      const isSubmission = !variables.id;
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        toast.success(
          `${isSubmission ? "Added" : "Updated"} ${
            data.fullName
          } beneficiary successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.fullName
        } beneficiary.`,
      );
    },
  });
  return mutation;
}

export function useDeleteBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBeneficiary,
    async onSuccess(data) {
      const queryKey2 = ["saccoGroup"];
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
      ]);
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        toast.success(`Deleted ${data.fullName} beneficiary successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete beneficiary.`);
    },
  });
}

export function useInsertManyBeneficiariesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManyBeneficiariesOptimized,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["beneficiaries"];
      const queryKey2: QueryKey = ["district", variables.districtId];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
      ]);
      queryClient.invalidateQueries({ queryKey });
      toast.success(`successfully created bulk staffs`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to create bulk staffs`);
    },
  });
}
