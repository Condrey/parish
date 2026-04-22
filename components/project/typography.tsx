import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export function TypographyH1({ className, children }: Props) {
  return (
    <h1 className={cn("text-3xl md:text-2xl font-bold", className)}>
      {children}
    </h1>
  );
}

export function TypographyH2({ className, children }: Props) {
  return <h1 className={cn("text-2xl", className)}>{children}</h1>;
}
