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
import { ParishData } from "@/lib/types";
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
import ButtonAddEditParish from "./button-add-edit-parish";
import ButtonDeleteParish from "./button-delete-parish";

export const useParishColumns: ColumnDef<ParishData>[] = [
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
      <DataTableColumnHeader column={column} title="Parish" />
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
    accessorKey: "subCounty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub county" />
    ),
    cell({ row }) {
      const { subCounty } = row.original;
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
    accessorKey: "subCounty.district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell({ row }) {
      const { subCounty } = row.original;
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
    accessorKey: "_count.villages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Villages" />
    ),
    cell({ row }) {
      const {
        _count: { villages: villageCount },
      } = row.original;
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(villageCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "villages._count.saccoGroups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sacco Groups" />
    ),
    cell({ row }) {
      const { villages } = row.original;
      const saccoGroupCount = villages.reduce(
        (acc, village) => acc + village._count.saccoGroups,
        0,
      );
      return (
        <div className="slashed-zero oldstyle-nums font-mono tabular-nums">
          {formatNumber(saccoGroupCount)}
        </div>
      );
    },
  },
  {
    accessorKey: "villages.saccoGroups._count.beneficiaries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SBeneficiaries" />
    ),
    cell({ row }) {
      const { villages } = row.original;
      const beneficiariesCount = villages
        .flatMap((village) =>
          village.saccoGroups.reduce(
            (acc, saccoGroup) => acc + saccoGroup._count.beneficiaries,
            0,
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
      const { id, subCounty } = row.original;
      const { districtId, id: subCountyId } = subCounty!;
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/district/${districtId}/sub-county/${subCountyId}/parish/${id}`,
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
              <ButtonAddEditParish
                parish={row.original}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit district
              </ButtonAddEditParish>
              <ButtonDeleteParish
                parish={row.original}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete district
              </ButtonDeleteParish>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
