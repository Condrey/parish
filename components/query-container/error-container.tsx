"use client";

import { cn } from "@/lib/utils";
import {
  DefinedUseQueryResult,
  QueryObserverLoadingErrorResult,
} from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface ErrorContainerProps {
  errorMessage: string;
  query: DefinedUseQueryResult | QueryObserverLoadingErrorResult;
  className?: string;
}

export default function ErrorContainer({
  errorMessage,
  query,
  className,
}: ErrorContainerProps) {
  console.error(query.error);
  return (
    <div
      className={cn(
        "bg-destructive/10 flex min-h-80 flex-col items-center justify-center gap-4 p-3 sm:bg-transparent",
        className,
      )}
    >
      <p className="text-muted-foreground max-w-sm text-center">
        {errorMessage}
      </p>
      <Button variant={"destructive"} onClick={() => query.refetch()}>
        {query.isFetching && <Spinner />}
        Refresh
      </Button>
    </div>
  );
}
