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
import { SubCountySchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { District } from "@/lib/generated/prisma/client";
import { useState } from "react";
import ButtonAddEditDistrict from "../district/button-add-edit-district";
import { getDistrictEnums } from "./action";

interface Props {
  form: UseFormReturn<SubCountySchema>;
  lockDistrictField: boolean;
}
export default function FieldDistrict({ form, lockDistrictField }: Props) {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["district-enum"],
    queryFn: getDistrictEnums,
    refetchOnWindowFocus: false,
  });

  const { data: districts, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get district enumerations"
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
  if (!districts.length) {
    return (
      <EmptyContainer
        title=""
        description="Add a district first before creating a sub-county."
        className="[&_svg]:hidden p-0"
      >
        <ButtonAddEditDistrict variant={"destructive"}>
          Add a district
        </ButtonAddEditDistrict>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="districtId"
      disabled={lockDistrictField}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>District</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={lockDistrictField}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenDistrictCommandItem
                      district={districts.find(
                        (district) => district.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose district..."
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
                      No district with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditDistrict variant={"secondary"}>
                      Add new District
                    </ButtonAddEditDistrict>
                  </CommandEmpty>
                  <CommandGroup className="">
                    {districts.map((district) => (
                      <CommandItem
                        key={district.id}
                        value={district.name + district.voteNumber}
                        onSelect={() => {
                          form.setValue("districtId", district.id);
                          form.clearErrors("districtId");
                          setOpen(false);
                        }}
                        className="w-full min-w-2xs"
                      >
                        <CommandItemDistrict
                          isChecked={field.value === district.id}
                          district={district}
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

function CommandItemDistrict({
  district,
  isChecked,
}: {
  district: District | undefined;
  isChecked: boolean;
}) {
  if (!district) return;
  const { name, voteNumber, votePhysicalAddress } = district;
  return (
    <div className="w-full  flex-1">
      <div className="flex gap-3 justify-between  items-center">
        <span>
          {voteNumber}: {name}
        </span>{" "}
        {isChecked && <CheckIcon className="size-4" />}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {votePhysicalAddress}
      </div>
    </div>
  );
}

function ChosenDistrictCommandItem({
  district,
}: {
  district: District | undefined;
}) {
  if (!district) return;
  const { name, voteNumber } = district;
  return (
    <div>
      {voteNumber}: {name}
    </div>
  );
}
