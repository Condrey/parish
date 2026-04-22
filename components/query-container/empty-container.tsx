import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { LucideIcon, MessageSquareMoreIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  description?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// To remove padding, default has p-6 and md:p-12
export function EmptyContainer({
  title,
  description,
  required = false,
  icon: Icon = MessageSquareMoreIcon,
  className,
  children,
}: Props) {
  return (
    <Empty className={cn("", className)}>
      <EmptyMedia variant={"default"}>
        <Icon
          className={cn(
            "size-20 fill-accent text-accent-foreground",
            required && "animate-bounce fill-primary text-primary-foreground",
          )}
          strokeWidth={0.5}
        />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle className={cn(required && "animate-pulse")}>
          {title}
        </EmptyTitle>
        <EmptyDescription className={cn(required && "animate-pulse")}>
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children} </EmptyContent>
    </Empty>
  );
}
