"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteParish, upsertParish } from "./action";

const queryKey: QueryKey = ["parishes"];

export function useUpsertParishMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertParish,
    onSuccess: async (data, variables) => {
      const queryKey2 = ["subCounty", variables.subCountyId];
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
          } parish successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } parish.`,
      );
    },
  });
  return mutation;
}

export function useDeleteParishMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteParish,
    async onSuccess(data) {
      const queryKey2 = ["subCounty"];
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
        toast.success(`Deleted ${data.name} parish successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete parish.`);
    },
  });
}
