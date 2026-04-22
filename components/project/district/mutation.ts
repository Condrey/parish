"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDistrict, upsertDistrict } from "./action";

const queryKey: QueryKey = ["districts"];

export function useUpsertDistrictMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertDistrict,
    onSuccess: async (data, variables) => {
      await Promise.all([await queryClient.cancelQueries({ queryKey })]);
      const isSubmission = !variables.id;
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        toast.success(
          `${isSubmission ? "Added" : "Updated"} ${
            data.name
          } district successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } district.`,
      );
    },
  });
  return mutation;
}

export function useDeleteDistrictMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDistrict,
    async onSuccess(data) {
      await queryClient.cancelQueries({ queryKey });
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        toast.success(`Deleted ${data.name} district successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete district.`);
    },
  });
}
