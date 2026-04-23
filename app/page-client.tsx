"use client";

import { getAllParishes } from "@/components/project/parish/action";
import {
  ChosenParishCommandItem,
  CommandItemParish,
} from "@/components/project/village/field-parish";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Button, ButtonProps } from "@/components/ui/button";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import kyInstance from "@/lib/ky";
import { ParishData } from "@/lib/types";
import {
  singleContentSchema,
  SingleContentSchema,
  VillageSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  BrainIcon,
  ChevronsUpDownIcon,
  CloudDownloadIcon,
  WrenchIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPasscodeValid } from "./action";

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
    <>
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
                            No parish with that name exists in the system,
                            please check the spelling.
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
              <RequestDownloadDialog
                type="button"
                parish={parish}
                variant={"destructive"}
                size={"lg"}
              >
                Request DownLoad
              </RequestDownloadDialog>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

interface RequestDownloadDialogProps extends ButtonProps {
  parish: ParishData;
}
function RequestDownloadDialog({
  parish,
  ...props
}: RequestDownloadDialogProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SingleContentSchema>({
    resolver: zodResolver(singleContentSchema),
    defaultValues: { singleContent: "" },
  });
  async function handleOnClickEvent(input: SingleContentSchema) {
    startTransition(async () => {
      const valid = await isPasscodeValid(input);
      if (valid) {
        const response = await kyInstance.post(`/api/template`, {
          body: JSON.stringify(parish),
        });
        if (response.ok) {
          const { message, url, isError } = await response.json<{
            message: string;
            url?: string;
            isError: boolean;
          }>();
          if (!isError && !!url) {
            toast.success(message);
            window.open(url, "_blank");
          } else {
            toast.error(message);
          }
        } else {
          toast.error(response.statusText);
        }
      } else {
        toast.error("You Failed, LoLest!", {
          description: (
            <div>
              <WrenchIcon className="inline" /> You are not that very smart as I
              thought. Smart brains shall have involvement in small trivial
              thins
              <BrainIcon className="inline" /> zero!
            </div>
          ),
        });
      }
    });
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent side="top">
        <div className="max-w-md mx-auto w-full">
          <SheetHeader>
            <SheetTitle>How best can you crack the passcode?</SheetTitle>
            <SheetDescription>
              To download beneficiary list of {parish.name.toUpperCase()}, you
              need to enter a correct passcode here below.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
            <div className="mx-4 mt-6 mb-16 space-y-6">
              <FormField
                control={form.control}
                name="singleContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passcode</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="please input the passcode"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs italic">
                      Hint: Day Grim Reaper eliminated alpha males in Misr.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={isPending}
                type="button"
                onClick={() => form.handleSubmit(handleOnClickEvent)()}
                size={"lg"}
                className="w-full"
              >
                <CloudDownloadIcon className="mr-2 size-5" /> Download Now
              </LoadingButton>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
