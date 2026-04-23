"use client";

import { getAllParishes } from "@/components/project/parish/action";
import { DownloadParishExtractButton } from "@/components/project/parish/download-bsc-button";
import {
  ChosenParishCommandItem,
  CommandItemParish,
} from "@/components/project/village/field-parish";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ParishData } from "@/lib/types";
import { VillageSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDownIcon, CloudDownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  parishes: ParishData[];
}
export default function PageClient({ parishes: initialData }: Props) {
  const [open, setOpen] = useState(false);
  const [parish, setParish] = useState<ParishData>();

  const form = useForm<VillageSchema>({
    defaultValues: {},
  });
  const selectedParishId = form.watch("parishId");

  const query = useQuery({
    queryKey: ["parishes"],
    queryFn: getAllParishes,
    initialData,
    refetchOnWindowFocus: false,
  });
  const { data: parishes, status } = query;

  useEffect(() => {
    if (selectedParishId) {
      const newParish = parishes.find((p) => p.id === selectedParishId);
      setParish(newParish);
    }
  }, [selectedParishId, parishes]);
  function submitIt() {}
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get parish enumerations"
        query={query}
      />
    );
  }
  if (!parishes.length) {
    return (
      <EmptyContainer
        title="There are no Parishes in DB"
        description="Add a parish first before creating a village."
        className="[&_svg]:hidden p-0"
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitIt)}
        className="w-full max-w-md space-y-8"
      >
        <FormField
          control={form.control}
          name="parishId"
          render={({ field }) => (
            <FormItem>
              <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between "
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
                    <CommandInput
                      placeholder="Search member..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty className="p-3 flex flex-col justify-center max-w-sm text-center items-center gap-2">
                        <p className="inline-block">
                          No parish with that name exists in the system, please
                          check the spelling.
                        </p>
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
              <FormDescription>
                Select Parish to download extract
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end items-center">
          {parish && (
            <DownloadParishExtractButton
            type="button"
              parish={parish}
              variant={"destructive"}
              size={"lg"}
            >
              <CloudDownloadIcon className="mr-2 size-5" /> DownLoad
            </DownloadParishExtractButton>
          )}
        </div>
      </form>
    </Form>
  );
}
