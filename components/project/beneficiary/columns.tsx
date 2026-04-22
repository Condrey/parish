/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { BeneficiaryData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Edit3Icon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import ButtonAddEditBeneficiary from "./button-add-edit-beneficiary";
import ButtonDeleteBeneficiary from "./button-delete-beneficiary";

export const useBeneficiaryColumns: ColumnDef<BeneficiaryData>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="s/n" />
    ),
    cell: ({ row }) => <span>{formatNumber(row.index + 1)}</span>,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiary fullname" />
    ),
    cell({ row }) {
      const { fullName, nin } = row.original;
      return (
        <div>
          <div className="capitalize">{fullName}</div>
          <div className="text-muted-foreground">{nin}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "memberId",
    header: ({ column }) => (
      <DataTableColumnHeader
        visible={false}
        column={column}
        title="Member ID and subsistence"
      />
    ),
    cell({ row }) {
      const { memberId, subsistence } = row.original;
      return (
        <div>
          <div className="capitalize">{memberId}</div>
          <div className="text-muted-foreground text-xs">{subsistence}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="M/ F" />
    ),
    cell({ row }) {
      const { gender } = row.original;
      return (
        <div>
          <div className="capitalize">{gender.substring(0, 1)}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact/ email" />
    ),
    cell({ row }) {
      const { contact, email } = row.original;
      return (
        <div>
          <div className="slashed-zero font-mono oldstyle-nums tabular-nums">
            {contact}
          </div>
          <div className="text-muted-foreground text-xs">{email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "saccoGroup.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sacco Group name" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "saccoGroup.village.parish.subCounty.district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
  },
  {
    accessorKey: "saccoGroup.village.parish.subCounty.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub county" />
    ),
  },
  {
    accessorKey: "saccoGroup.village.parish.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parish" />
    ),
  },
  {
    accessorKey: "saccoGroup.village.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Village" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell({ row }) {
      const { createdAt } = row.original;
      return (
        <div>
          <div className="slashed-zero font-mono oldstyle-nums tabular-nums text-muted-foreground">
            {formatDate(createdAt, "PP")}
          </div>
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
      const beneficiary = row.original;

      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-lg"}>
              <MoreHorizontalIcon />
              <span className="sr-only">View more</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-3xs">
            <DropdownMenuGroup className="flex flex-col gap-2">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ButtonAddEditBeneficiary
                beneficiary={beneficiary}
                variant={"ghost"}
                className="justify-start"
              >
                <Edit3Icon /> Edit Sacco Group
              </ButtonAddEditBeneficiary>
              <ButtonDeleteBeneficiary
                beneficiary={beneficiary}
                variant={"destructive"}
                className="justify-start"
              >
                <Trash2Icon /> Delete Sacco Group
              </ButtonDeleteBeneficiary>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
