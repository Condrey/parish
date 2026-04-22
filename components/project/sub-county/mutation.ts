"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSubCounty, upsertSubCounty } from "./action";

const queryKey: QueryKey = ["subCounties"];

export function useUpsertSubCountyMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertSubCounty,
    onSuccess: async (data, variables) => {
      const queryKey2 = ["district", variables.districtId];
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
          } subCounty successfully`,
        );
      }
    },
    onError(error, variables) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } subCounty.`,
      );
    },
  });
  return mutation;
}

export function useDeleteSubCountyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubCounty,
    async onSuccess(data) {
      const queryKey2 = ["district"];
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
        toast.success(`Deleted ${data.name} subCounty successfully`);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(`Failed to delete subCounty.`);
    },
  });
}
