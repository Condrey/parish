"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSaccoGroup, upsertSaccoGroup } from "./action";

const queryKey: QueryKey = ["saccoGroups"];

export function useUpsertSaccoGroupMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertSaccoGroup,
    onSuccess: async (data, variables) => {
      const queryKey2 = ["village", variables.villageId];
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
          } saccoGroup successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } saccoGroup.`,
      );
    },
  });
  return mutation;
}

export function useDeleteSaccoGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaccoGroup,
    async onSuccess(data) {
      const queryKey2 = ["village"];
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
        toast.success(`Deleted ${data.name} Sacco Group successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete Sacco Group.`);
    },
  });
}
