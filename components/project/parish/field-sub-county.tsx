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
import { ParishSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { useState } from "react";
import ButtonAddEditSubCounty from "../sub-county/button-add-edit-sub-county";
import { getSubCountyEnums, SubCountyEnumData } from "./action";

interface Props {
  form: UseFormReturn<ParishSchema>;
  lockSubCountyField: boolean;
}
export default function FieldSubCounty({ form, lockSubCountyField }: Props) {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["subCounty-enum"],
    queryFn: getSubCountyEnums,
    refetchOnWindowFocus: false,
  });

  const { data: subCounties, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get subCounty enumerations"
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
  if (!subCounties.length) {
    return (
      <EmptyContainer
        title=""
        description="Add a subCounty first before creating a sub-county."
        className="[&_svg]:hidden p-0"
      >
        <ButtonAddEditSubCounty variant={"destructive"}>
          Add a subCounty
        </ButtonAddEditSubCounty>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="subCountyId"
      disabled={lockSubCountyField}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>SubCounty</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={lockSubCountyField}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenSubCountyCommandItem
                      subCounty={subCounties.find(
                        (subCounty) => subCounty.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose subCounty..."
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
                      No subCounty with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditSubCounty variant={"secondary"}>
                      Add new SubCounty
                    </ButtonAddEditSubCounty>
                  </CommandEmpty>
                  <CommandGroup className="">
                    {subCounties.map((subCounty) => (
                      <CommandItem
                        key={subCounty.id}
                        value={
                          subCounty.name +
                          subCounty.district?.name +
                          subCounty.district?.voteNumber
                        }
                        onSelect={() => {
                          form.setValue("subCountyId", subCounty.id);
                          form.clearErrors("subCountyId");
                          setOpen(false);
                        }}
                        className="w-full min-w-2xs"
                      >
                        <CommandItemSubCounty
                          isChecked={field.value === subCounty.id}
                          subCounty={subCounty}
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

function CommandItemSubCounty({
  subCounty,
  isChecked,
}: {
  subCounty: SubCountyEnumData | undefined;
  isChecked: boolean;
}) {
  if (!subCounty) return;
  const { name: subCountyName, district } = subCounty;
  const { voteNumber, name } = district!;
  return (
    <div className="w-full  flex-1">
      <div className="flex gap-3 justify-between  items-center">
        <span>{subCountyName}</span>{" "}
        {isChecked && <CheckIcon className="size-4" />}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {voteNumber}: {name}{" "}
      </div>
    </div>
  );
}

function ChosenSubCountyCommandItem({
  subCounty,
}: {
  subCounty: SubCountyEnumData | undefined;
}) {
  if (!subCounty) return;
  const { name: subCountyName, district } = subCounty;
  const { voteNumber, name } = district!;
  return (
    <div>
      {subCountyName} - {name}({voteNumber})
    </div>
  );
}
