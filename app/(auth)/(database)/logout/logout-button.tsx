"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { logout } from "./actions";

interface LogoutButtonProps extends ButtonProps {
  redirectUrl?: string;
  className?: string;
}

export default function LogoutButton({
  redirectUrl,
  className,
  ...props
}: LogoutButtonProps) {
  console.log("signing out ....");
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set(REDIRECT_TO_URL_SEARCH_PARAMS, currentPathname);
  const redirectToUrl =
    redirectUrl ?? currentPathname + "?" + newParams.toString();

  async function logOutClicked() {
    startTransition(async () => {
      queryClient.clear();
      await logout(redirectToUrl);
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      onClick={logOutClicked}
      className={cn("text-inherit", className)}
      {...props}
    />
  );
}
