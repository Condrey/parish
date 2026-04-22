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
import { DistrictData } from "@/lib/types";
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
import ButtonAddEditDistrict from "./button-add-edit-district";
import ButtonDeleteDistrict from "./button-delete-district";

export const useDistrictColumns: ColumnDef<DistrictData>[] = [
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
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell({ row }) {
      const { name, voteNumber, votePhysicalAddress, votePostalAddress } =
        row.original;
      return (
        <div>
          <div className="capitalize">{name}</div>
          <div>{voteNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "_count.subCounties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub-counties" />
    ),
    cell({ row }) {
      const {
        _count: { subCounties: subCountyCount },
      } = row.original;
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(subCountyCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "subCounties._count.parishes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parishes" />
    ),
    cell({ row }) {
      const { subCounties } = row.original;
      const parishCount = subCounties.reduce(
        (acc, subCounty) => acc + subCounty._count.parishes,
        0,
      );
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(parishCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "subCounties.parishes._count.villages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Villages" />
    ),
    cell({ row }) {
      const { subCounties } = row.original;
      const villageCount = subCounties
        .flatMap((subCounty) =>
          subCounty.parishes.reduce(
            (acc, parish) => acc + parish._count.villages,
            0,
          ),
        )
        .reduce((acc, count) => acc + count, 0);
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(villageCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "subCounties.parishes.villages._count.saccoGroups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sacco Groups" />
    ),
    cell({ row }) {
      const { subCounties } = row.original;
      const saccoGroupCount = subCounties
        .flatMap((subCounty) =>
          subCounty.parishes.flatMap((parish) =>
            parish.villages.reduce(
              (acc, village) => acc + village._count.saccoGroups,
              0,
            ),
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
    accessorKey:
      "subCounties.parishes.villages.saccoGroups._count.beneficiaries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiaries" />
    ),
    cell({ row }) {
      const { subCounties } = row.original;
      const beneficiariesCount = subCounties
        .flatMap((subCounty) =>
          subCounty.parishes.flatMap((parish) =>
            parish.villages.flatMap((village) =>
              village.saccoGroups.reduce(
                (acc, saccoGroup) => acc + saccoGroup._count.beneficiaries,
                0,
              ),
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
      const { id } = row.original;
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(`/district/${id}`);
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
                  {!isPending ? <ArrowUpRightIcon /> : <Spinner />}View details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="flex flex-col gap-2">
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Secondary actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ButtonAddEditDistrict
                district={row.original}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit district
              </ButtonAddEditDistrict>
              <ButtonDeleteDistrict
                district={row.original}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete district
              </ButtonDeleteDistrict>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
