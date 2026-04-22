"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  ROWS_PER_PAGE?: number;
}

export function DataTablePagination<TData>({
  table,
  ROWS_PER_PAGE = 5,
}: DataTablePaginationProps<TData>) {
  useEffect(() => {
    table.setPageSize(ROWS_PER_PAGE);
  }, [ROWS_PER_PAGE, table]);
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;
  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row sm:gap-2">
      <div className="flex-1 hidden sm:flex text-sm text-muted-foreground">
        {selectedRows === 0
          ? `${totalRows.toLocaleString()} item${totalRows === 1 ? "" : "s"}.`
          : `${selectedRows.toLocaleString()} of ${totalRows.toLocaleString()} item${totalRows === 1 ? "" : "s"} selected.`}
      </div>
      <div className="flex flex-wrap justify-between items-center space-x-6 md:flex-nowrap lg:space-x-8">
        <div className="flex sm:items-center space-x-2">
          <p className="text-sm hidden sm:flex font-medium">Items per page</p>
          <Select
            defaultValue={"5"}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="ml-auto flex w-full items-center justify-end space-x-2 sm:ml-0 sm:w-auto sm:justify-normal">
          <Button
            variant={!table.getCanPreviousPage() ? "outline" : "default"}
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={!table.getCanPreviousPage() ? "outline" : "default"}
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={!table.getCanNextPage() ? "outline" : "default"}
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={!table.getCanNextPage() ? "outline" : "default"}
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
