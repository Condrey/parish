/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { SubCountyData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpRightIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import ButtonAddEditSubCounty from "./button-add-edit-sub-county";
import ButtonDeleteSubCounty from "./button-delete-sub-county";

export const useSubCountyColumns: ColumnDef<SubCountyData>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="s/n" />
    ),
    cell: ({ row }) => <span>{formatNumber(row.index + 1)}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub County" />
    ),
    cell({ row }) {
      const { name } = row.original;
      return (
        <div>
          <div className="capitalize">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell({ row }) {
      const { district } = row.original;
      if (!district) {
        return (
          <div className="text-destructive text-xs">No district attached</div>
        );
      }
      const { name, voteNumber } = district;
      return (
        <div>
          <div className="capitalize">{name}</div>
          <div>{voteNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "_count.parishes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parishes" />
    ),
    cell({ row }) {
      const {
        _count: { parishes: parishCount },
      } = row.original;
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(parishCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "parishes._count.villages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Villages" />
    ),
    cell({ row }) {
      const { parishes } = row.original;
      const villageCount = parishes.reduce(
        (acc, parish) => acc + parish._count.villages,
        0,
      );
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(villageCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "parishes.villages._count.saccoGroups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sacco Groups" />
    ),
    cell({ row }) {
      const { parishes } = row.original;
      const saccoGroupCount = parishes
        .flatMap((parish) =>
          parish.villages.reduce(
            (acc, village) => acc + village._count.saccoGroups,
            0,
          ),
        )
        .reduce((acc, count) => acc + count, 0);
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(saccoGroupCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "parishes.villages.saccoGroups._count.beneficiaries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiaries" />
    ),
    cell({ row }) {
      const { parishes } = row.original;
      const beneficiariesCount = parishes
        .flatMap((parish) =>
          parish.villages.flatMap((village) =>
            village.saccoGroups.reduce(
              (acc, saccoGroup) => acc + saccoGroup._count.beneficiaries,
              0,
            ),
          ),
        )
        .reduce((acc, count) => acc + count, 0);
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(beneficiariesCount)}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell({ row }) {
      const { id, districtId } = row.original;
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/district/${districtId}/sub-county/${id}`,
      );
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-lg"}>
              <MoreHorizontalIcon />
              <span className="sr-only">View more</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-3xs">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuItem
                asChild
                onClick={() => startTransition(() => {})}
              >
                <Link href={url}>
                  {!isPending ? <ArrowUpRightIcon /> : <Spinner />}View
                  SubCounty details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="flex flex-col gap-2">
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Secondary actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ButtonAddEditSubCounty
                subCounty={row.original}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit SubCounty
              </ButtonAddEditSubCounty>
              <ButtonDeleteSubCounty
                subCounty={row.original}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete SubCounty
              </ButtonDeleteSubCounty>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
