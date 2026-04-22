import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DataTableLoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-fit w-full animate-pulse flex-col gap-4 overflow-y-auto rounded-2xl bg-card p-4",
        className,
      )}
    >
      <div className="flex gap-3">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-12 w-1/3" />
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="h-24 w-1/3" />
          <Skeleton className="h-24 w-1/3" />
          <Skeleton className="h-24 w-1/3" />
        </div>
      ))}
    </div>
  );
}
