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
import { SaccoGroupSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { useState } from "react";
import ButtonAddEditVillage from "../sub-county/button-add-edit-sub-county";
import { getVillageEnums, VillageEnumData } from "./action";

interface Props {
  form: UseFormReturn<SaccoGroupSchema>;
  lockVillageField: boolean;
}
export default function FieldVillage({ form, lockVillageField }: Props) {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["village-enum"],
    queryFn: getVillageEnums,
    refetchOnWindowFocus: false,
  });

  const { data: villages, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get village enumerations"
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
  if (!villages.length) {
    return (
      <EmptyContainer
        title=""
        description="Add a village first before creating a sub-county."
        className="[&_svg]:hidden p-0"
      >
        <ButtonAddEditVillage variant={"destructive"}>
          Add a village
        </ButtonAddEditVillage>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="villageId"
      disabled={lockVillageField}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Village</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={lockVillageField}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenVillageCommandItem
                      village={villages.find(
                        (village) => village.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose village..."
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
                      No village with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditVillage variant={"secondary"}>
                      Add new Village
                    </ButtonAddEditVillage>
                  </CommandEmpty>
                  <CommandGroup className="">
                    {villages.map((village) => (
                      <CommandItem
                        key={village.id}
                        value={
                          village.name +
                          village.parish?.name +
                          village.parish?.subCounty?.name +
                          village.parish?.subCounty?.district?.name +
                          village.parish?.subCounty?.district?.voteNumber
                        }
                        onSelect={() => {
                          form.setValue("villageId", village.id);
                          form.clearErrors("villageId");
                          setOpen(false);
                        }}
                        className="w-full min-w-2xs"
                      >
                        <CommandItemVillage
                          isChecked={field.value === village.id}
                          village={village}
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

function CommandItemVillage({
  village,
  isChecked,
}: {
  village: VillageEnumData | undefined;
  isChecked: boolean;
}) {
  if (!village) return;
  const { name: villageName, parish } = village;
  const { name: parishName, subCounty } = parish!;
  const { name: subCountyName, district } = subCounty!;
  const { voteNumber, name } = district!;
  return (
    <div className="w-full  flex-1">
      <div className="flex gap-3 justify-between  items-center">
        <span>{villageName}</span>{" "}
        {isChecked && <CheckIcon className="size-4" />}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {subCountyName}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {parishName}- {name}({voteNumber})
      </div>
    </div>
  );
}

function ChosenVillageCommandItem({
  village,
}: {
  village: VillageEnumData | undefined;
}) {
  if (!village) return;
  const { name: villageName, parish } = village;
  const { name: parishName, subCounty } = parish!;

  const { district } = subCounty!;
  const { voteNumber } = district!;
  return (
    <div>
      {villageName} - {parishName}({voteNumber})
    </div>
  );
}
