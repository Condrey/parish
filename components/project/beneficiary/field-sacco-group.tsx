import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { BeneficiarySchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { useState } from "react";
import ButtonAddEditSaccoGroup from "../sub-county/button-add-edit-sub-county";
import { getSaccoGroupEnums, SaccoGroupEnumData } from "./action";

interface Props {
  form: UseFormReturn<BeneficiarySchema>;
  lockSaccoGroupField: boolean;
}
export default function FieldSaccoGroup({ form, lockSaccoGroupField }: Props) {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["saccoGroup-enum"],
    queryFn: getSaccoGroupEnums,
    refetchOnWindowFocus: false,
  });

  const { data: saccoGroups, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get saccoGroup enumerations"
        query={query}
      />
    );
  }
  if (status === "pending") {
    return (
      <div className="space-y-3 w-full animate-pulse">
        <Skeleton className="w-1/3 h-6" />
        <Skeleton className="w-full h-9" />
      </div>
    );
  }
  if (!saccoGroups.length) {
    return (
      <EmptyContainer
        title=""
        description="Add a saccoGroup first before creating a sub-county."
        className="[&_svg]:hidden p-0"
      >
        <ButtonAddEditSaccoGroup variant={"destructive"}>
          Add a saccoGroup
        </ButtonAddEditSaccoGroup>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="saccoGroupId"
      disabled={lockSaccoGroupField}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>SaccoGroup</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={lockSaccoGroupField}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenSaccoGroupCommandItem
                      saccoGroup={saccoGroups.find(
                        (saccoGroup) => saccoGroup.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose saccoGroup..."
                  )}
                  <ChevronsUpDownIcon className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search member..." className="h-9" />
                <CommandList>
                  <CommandEmpty className="p-3 flex flex-col justify-center max-w-sm text-center items-center gap-2">
                    <p className="inline-block">
                      No saccoGroup with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditSaccoGroup variant={"secondary"}>
                      Add new SaccoGroup
                    </ButtonAddEditSaccoGroup>
                  </CommandEmpty>
                  <CommandGroup className="">
                    {saccoGroups.map((saccoGroup) => (
                      <CommandItem
                        key={saccoGroup.id}
                        value={
                          saccoGroup.name +
                          saccoGroup.village?.name +
                          saccoGroup.village?.parish?.name +
                          saccoGroup.village?.parish?.subCounty?.name +
                          saccoGroup.village?.parish?.subCounty?.district
                            ?.name +
                          saccoGroup.village?.parish?.subCounty?.district
                            ?.voteNumber
                        }
                        onSelect={() => {
                          form.setValue("saccoGroupId", saccoGroup.id);
                          form.clearErrors("saccoGroupId");
                          setOpen(false);
                        }}
                        className="w-full min-w-2xs"
                      >
                        <CommandItemSaccoGroup
                          isChecked={field.value === saccoGroup.id}
                          saccoGroup={saccoGroup}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}

function CommandItemSaccoGroup({
  saccoGroup,
  isChecked,
}: {
  saccoGroup: SaccoGroupEnumData | undefined;
  isChecked: boolean;
}) {
  if (!saccoGroup) return;
  const { name: saccoGroupName, village } = saccoGroup;
  const { name: villageName, parish } = village!;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { voteNumber, name } = district!;
  return (
    <div className="w-full  flex-1">
      <div className="flex gap-3 justify-between  items-center">
        <span>{saccoGroupName}</span>{" "}
        {isChecked && <CheckIcon className="size-4" />}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {villageName},{subCountyName}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {parishName}- {name}({voteNumber})
      </div>
    </div>
  );
}

function ChosenSaccoGroupCommandItem({
  saccoGroup,
}: {
  saccoGroup: SaccoGroupEnumData | undefined;
}) {
  if (!saccoGroup) return;
  const { name: saccoGroupName, village } = saccoGroup;
  const { name: villageName, parish } = village!;
  const { name: parishName, subCounty } = parish!;
  const { district } = subCounty!;
  const { voteNumber } = district!;
  return (
    <div className="truncate line-clamp-1 max-w-2xs">
      {saccoGroupName}: {villageName}- {parishName}({voteNumber})
    </div>
  );
}
