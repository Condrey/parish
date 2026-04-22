"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteVillage, upsertVillage } from "./action";

const queryKey: QueryKey = ["villages"];

export function useUpsertVillageMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertVillage,
    onSuccess: async (data, variables) => {
      const queryKey2 = ["parish", variables.parishId];
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
            data.name
          } village successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } village.`,
      );
    },
  });
  return mutation;
}

export function useDeleteVillageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVillage,
    async onSuccess(data) {
      const queryKey2 = ["parish"];
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
        toast.success(`Deleted ${data.name} village successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete village.`);
    },
  });
}
