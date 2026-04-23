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
import { VillageSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { useState } from "react";
import ButtonAddEditParish from "../parish/button-add-edit-parish";
import { getParishEnums, ParishEnumData } from "./action";

interface Props {
  form: UseFormReturn<VillageSchema>;
  lockParishField: boolean;
}
export default function FieldParish({ form, lockParishField }: Props) {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["parish-enum"],
    queryFn: getParishEnums,
    refetchOnWindowFocus: false,
  });

  const { data: parishes, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get parish enumerations"
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
  if (!parishes.length) {
    return (
      <EmptyContainer
        title=""
        description="Add a parish first before creating a village."
        className="[&_svg]:hidden p-0"
      >
        <ButtonAddEditParish variant={"destructive"}>
          Add a parish
        </ButtonAddEditParish>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="parishId"
      disabled={lockParishField}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Parish</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={lockParishField}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenParishCommandItem
                      parish={parishes.find(
                        (parish) => parish.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose parish..."
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
                      No parish with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditParish variant={"secondary"}>
                      Add new Parish
                    </ButtonAddEditParish>
                  </CommandEmpty>
                  <CommandGroup className="">
                    {parishes.map((parish) => (
                      <CommandItem
                        key={parish.id}
                        value={
                          parish.name +
                          parish.subCounty?.name +
                          parish.subCounty?.district?.name +
                          parish.subCounty?.district?.voteNumber
                        }
                        onSelect={() => {
                          form.setValue("parishId", parish.id);
                          form.clearErrors("parishId");
                          setOpen(false);
                        }}
                        className="w-full min-w-2xs"
                      >
                        <CommandItemParish
                          isChecked={field.value === parish.id}
                          parish={parish}
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

export function CommandItemParish({
  parish,
  isChecked,
}: {
  parish: ParishEnumData | undefined;
  isChecked: boolean;
}) {
  if (!parish) return;
  const { name: parishName, subCounty } = parish;
  const { district, name: subCountyName } = subCounty!;
  const { voteNumber, name } = district!;
  return (
    <div className="w-full  flex-1">
      <div className="flex gap-3 justify-between  items-center">
        <span>{parishName}</span>{" "}
        {isChecked && <CheckIcon className="size-4" />}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {name}- {subCountyName}({voteNumber})
      </div>
    </div>
  );
}

export function ChosenParishCommandItem({
  parish,
}: {
  parish: ParishEnumData | undefined;
}) {
  if (!parish) return;
  const { name: parishName, subCounty } = parish;
  const { name: subCountyName } = subCounty!;
  return (
    <div>
      {parishName} - {subCountyName}
    </div>
  );
}
