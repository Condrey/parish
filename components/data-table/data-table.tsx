"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { MOBILE_MAX_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { FunnelIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import InfiniteScrollContainer from "../infinite-scroll-container";
import { DataColumnFilter } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleClick?: (rowId: string) => void;
  ROWS_PER_TABLE?: number;
  selectedItemId?: string | null;
  filterColumn?: { id: string; label?: string };
  children?: React.ReactNode;
  fab?: React.ReactNode;
  tableHeaderSection?: React.ReactNode;
  className?: string;

  cardRenderer?: (row: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  ROWS_PER_TABLE = 5,
  selectedItemId,
  handleClick,
  filterColumn,
  children,
  tableHeaderSection,
  fab,
  className,
  cardRenderer,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [count, setCount] = React.useState(5);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  });

  return (
    <>
      {/* mobile view  */}
      <div className={cn("space-y-6     size-full lg:hidden ", className)}>
        <div className="w-full flex justify-between gap-2">
          {!!filterColumn && (
            <div className={cn("relative flex w-full max-w-md")}>
              <SearchIcon className="absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-foreground peer-focus-visible:text-foreground" />
              <Input
                placeholder={`Search by ${filterColumn.label ?? filterColumn.id}...`}
                value={
                  (table
                    .getColumn(filterColumn.id)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn.id)
                    ?.setFilterValue(event.target.value)
                }
                className="peer flex-1 ps-7"
              />
            </div>
          )}
          <DataColumnFilter table={table}>
            <FunnelIcon className="shrink" />{" "}
            <span className="shrink hidden sm:block">Sort</span>
          </DataColumnFilter>
        </div>

        <div className="h-full  ">
          <div className="absolute z-40 bottom-3 right-3">{fab}</div>
          <InfiniteScrollContainer
            onBottomReached={() => {
              setCount((count) => count + MOBILE_MAX_ITEMS);
            }}
          >
            {table.getRowModel().rows.length ? (
              <div className="grid gap-3 lg:hidden sm:grid-cols-2">
                {table
                  .getRowModel()
                  .rows.slice(0, count)
                  .map((row) => {
                    const rowItem = row.original as TData;
                    return (
                      <div
                        key={row.id}
                        onClick={() =>
                          handleClick
                            ? handleClick((row.original as { id: string }).id)
                            : undefined
                        }
                      >
                        {cardRenderer?.(rowItem)}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No results
              </div>
            )}
          </InfiniteScrollContainer>
        </div>
      </div>
      {/* Desktop view  */}
      {/***
    * Set this style in sidebar component for its children
    *      style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--actual-sidebar-width":
                !contextValue.isMobile && !contextValue.open
                  ? SIDEBAR_WIDTH_ICON
                  : !contextValue.isMobile && contextValue.open
                    ? SIDEBAR_WIDTH
                    : "",
              ...style,
            } as React.CSSProperties
    */}
      <div
        className={cn(
          "w-fit hidden dark:bg-card/50 border p-2  lg:block max-w-dvw  rounded-md",
          "max-w-[calc(100vw-var(--actual-sidebar-width)-(--spacing(4))-8px)]",
          className,
        )}
      >
        <div className="w-full">{tableHeaderSection}</div>
        {/* filtering , column visibility and children */}
        <div className="flex items-center gap-2 justify-between py-4">
          {!!filterColumn && (
            <div className="relative">
              <SearchIcon className="absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-foreground peer-focus-visible:text-foreground" />
              <Input
                placeholder={`Search by ${filterColumn.label ?? filterColumn.id}...`}
                value={
                  (table
                    .getColumn(filterColumn.id)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn.id)
                    ?.setFilterValue(event.target.value)
                }
                className="peer max-w-sm ps-7"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            {children}
          </div>
        </div>
        <div className="pb-4 lg:pb-8">
          <Table className="border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-success text-success-foreground *:text-success-foreground hover:bg-success "
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const rowItem = row.original as { id: string };
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() =>
                        handleClick ? handleClick(rowItem.id) : undefined
                      }
                      className={cn(
                        "odd:bg-accent even:bg-accent/50 *:border",
                        !handleClick
                          ? "cursor-default"
                          : "group/row cursor-pointer",
                        // rowItem.id! === selectedItemId && "bg-muted",
                      )}
                    >
                      {row.getVisibleCells().map((cell, index, array) => (
                        <TableCell
                          key={cell.id}
                          className="w-fit first:text-success first:text-xl first:font-bold first-letter:text-end"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* pagination  */}

        <DataTablePagination
          table={table}
          ROWS_PER_PAGE={isMobile ? count : ROWS_PER_TABLE}
        />
      </div>
    </>
  );
}
