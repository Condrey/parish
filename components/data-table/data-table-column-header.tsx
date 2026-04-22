import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { Column, Table } from "@tanstack/react-table";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> &
    ButtonProps & {
      column: Column<TData, TValue>;
      title: string;
      visible?: boolean;
    };

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  variant,
  size,
  visible = true,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  useEffect(() => {
    if (visible) column.toggleVisibility(visible);
  }, [visible, column]);
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || "ghost"}
            size={size || "sm"}
            className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
            {...props}
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type DataColumnFilterProps<TData> = React.HTMLAttributes<HTMLDivElement> &
  ButtonProps & {
    table: Table<TData>;
  };

export function DataColumnFilter<TData>({
  table,
  variant,
  ...props
}: DataColumnFilterProps<TData>) {
  const columns = table.getAllColumns().filter((col) => col.getCanSort());
  if (!columns.length) return null;
  const containsSorting = columns.some((c) => c.getIsSorted());
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={containsSorting ? "destructive" : variant || "ghost"}
            {...props}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => {
              const title = getColumnTitle(column);
              const sorted = column.getIsSorted();

              return (
                <DropdownMenuSub key={column.id}>
                  <DropdownMenuSubTrigger className="capitalize">
                    {sorted && <CheckIcon />}
                    {title}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>Sort by order</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={sorted === "asc"}
                        onCheckedChange={() => column.toggleSorting(false)}
                      >
                        Ascending{" "}
                        <ArrowUpIcon className="ms-auto size-4 inline" />
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sorted === "desc"}
                        onCheckedChange={() => column.toggleSorting(true)}
                      >
                        Descending
                        <ArrowDownIcon className="ms-auto size-4 inline" />
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => table.resetSorting()}
          >
            <XIcon className="mr-2 size-4" />
            Clear Sorting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <pre>{JSON.stringify(columns, null, 2)}</pre> */}
    </>
  );
}

function getColumnTitle<TData>(column: Column<TData, unknown>) {
  const header = column.columnDef.header;

  if (typeof header === "string") return header;

  if (typeof column.id === "string") {
    return column.id.replace(/_/g, " ");
  }

  return "Column";
}
