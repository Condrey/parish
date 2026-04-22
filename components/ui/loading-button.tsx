"use client";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Spinner } from "./spinner";

interface Props extends ButtonProps {
  loading: boolean;
}
export default function LoadingButton({
  loading,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Spinner className="inline mr-2" />}
      <span className={cn(loading ? "[&>svg]:hidden " : "[&>svg]:inline mr-2")}>
        {children}
      </span>
    </Button>
  );
}
