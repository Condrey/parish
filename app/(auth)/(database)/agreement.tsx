import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Agreement({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      By continuing, you agree to the{" "}
      <Link
        href={"/terms-and-conditions"}
        className="hover:text-primary font-semibold underline transition-colors ease-linear"
        target="_blank"
      >
        terms and conditions
      </Link>{" "}
      and the use of cookies.
    </p>
  );
}
