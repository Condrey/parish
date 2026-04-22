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
import { SaccoGroupData } from "@/lib/types";
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
import ButtonAddEditSaccoGroup from "./button-add-edit-sacco-group";
import ButtonDeleteSaccoGroup from "./button-delete-sacco-group";

export const useSaccoGroupColumns: ColumnDef<SaccoGroupData>[] = [
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
      <DataTableColumnHeader column={column} title="SaccoGroup" />
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
    accessorKey: "village.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Village" />
    ),
    cell({ row }) {
      const { village } = row.original;
      if (!village) {
        return (
          <div className="text-destructive text-xs">No sub-county attached</div>
        );
      }
      const { name: villageName } = village;
      return (
        <div>
          <div className="capitalize">{villageName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "village.parish.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parish" />
    ),
    cell({ row }) {
      const { village } = row.original;
      const { parish } = village!;
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
    accessorKey: "village.parish.subCounty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub county" />
    ),
    cell({ row }) {
      const { village } = row.original;
      const { parish } = village!;
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
    accessorKey: "village.parish.subCounty.district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell({ row }) {
      const { village } = row.original;
      const { parish } = village!;
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
    accessorKey: "_count.beneficiaries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiaries" />
    ),
    cell({ row }) {
      const {
        _count: { beneficiaries: beneficiariesCount },
      } = row.original;
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
      const { village, villageId, id } = row.original;
      const { parish, parishId } = village!;
      const { subCounty } = parish!;
      const { districtId, id: subCountyId } = subCounty!;
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/district/${districtId}/sub-county/${subCountyId}/parish/${parishId}/village/${villageId}/sacco-group/${id}`,
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
              <ButtonAddEditSaccoGroup
                saccoGroup={row.original}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit Sacco Group
              </ButtonAddEditSaccoGroup>
              <ButtonDeleteSaccoGroup
                saccoGroup={row.original}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete Sacco Group
              </ButtonDeleteSaccoGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
