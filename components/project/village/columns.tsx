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
import { VillageData } from "@/lib/types";
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
import ButtonAddEditVillage from "./button-add-edit-village";
import ButtonDeleteVillage from "./button-delete-village";

export const useVillageColumns: ColumnDef<VillageData>[] = [
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
      <DataTableColumnHeader column={column} title="Village" />
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
    accessorKey: "parish",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parish" />
    ),
    cell({ row }) {
      const { parish } = row.original;
      if (!parish) {
        return (
          <div className="text-destructive text-xs">No parish attached</div>
        );
      }
      const { name: parishName } = parish;
      return (
        <div>
          <div className="capitalize">{parishName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "parish.subCounty.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub county" />
    ),
    cell({ row }) {
      const { parish } = row.original;
      const { subCounty } = parish!;
      if (!subCounty) {
        return (
          <div className="text-destructive text-xs">No sub-county attached</div>
        );
      }
      const { name: subCountyName } = subCounty;
      return (
        <div>
          <div className="capitalize">{subCountyName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "parish.subCounty.district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell({ row }) {
      const { parish } = row.original;
      const { subCounty } = parish!;
      if (!subCounty) {
        return (
          <div className="text-destructive text-xs">No sub-county attached</div>
        );
      }
      const { district } = subCounty;
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
    accessorKey: "_count.saccoGroups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sacco Groups" />
    ),
    cell({ row }) {
      const {
        _count: { saccoGroups: saccoGroupCount },
      } = row.original;
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(saccoGroupCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "saccoGroups._count.beneficiaries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiaries" />
    ),
    cell({ row }) {
      const { saccoGroups } = row.original;
      const beneficiaryCount = saccoGroups.reduce(
        (acc, saccoGroup) => acc + saccoGroup._count.beneficiaries,
        0,
      );
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(beneficiaryCount)}
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
      const { id, parish, parishId } = row.original;
      const { subCounty, subCountyId } = parish!;
      const { districtId } = subCounty!;
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/district/${districtId}/sub-county/${subCountyId}/parish/${parishId}/village/${id}`,
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
                  {!isPending ? <ArrowUpRightIcon /> : <Spinner />}View details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="flex flex-col gap-2">
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Secondary actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ButtonAddEditVillage
                village={row.original}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit district
              </ButtonAddEditVillage>
              <ButtonDeleteVillage
                village={row.original}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete district
              </ButtonDeleteVillage>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
