"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { ParishData } from "@/lib/types";
import ky from "ky";
import { useTransition } from "react";
import { toast } from "sonner";

interface DownloadParishExtractButtonProps extends ButtonProps {
  parish: ParishData;
}

export function DownloadParishExtractButton({
  parish,
  ...props
}: DownloadParishExtractButtonProps) {
  const [isPending, startTransition] = useTransition();
  async function handleOnClickEvent() {
    startTransition(async () => {
      const response = await ky.post(`/api/template`, {
        body: JSON.stringify(parish),
      });
      if (response.ok) {
        const { message, url, isError } = await response.json<{
          message: string;
          url?: string;
          isError: boolean;
        }>();
        if (!isError && !!url) {
          toast.success(message);
          window.open(url, "_blank");
        } else {
          toast.error(message);
        }
      } else {
        toast.error(response.statusText);
      }
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      onClick={handleOnClickEvent}
      title={`Download Extract for ${parish.name}`}
      {...props}
    />
  );
}
