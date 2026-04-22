/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NumberInput } from "@/components/number-input/number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DistrictData } from "@/lib/types";
import { districtSchema, DistrictSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpsertDistrictMutation } from "./mutation";

interface FormAddEditDistrictProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  districtToEdit?: DistrictData;
}
export default function FormAddEditDistrict({
  open,
  setOpen,
  districtToEdit,
}: FormAddEditDistrictProps) {
  const form = useForm<DistrictSchema>({
    resolver: zodResolver(districtSchema),
    values: {
      id: districtToEdit?.id || "",
      name: districtToEdit?.name || "",
      voteNumber: districtToEdit?.voteNumber!,
      votePhysicalAddress: districtToEdit?.votePhysicalAddress || "",
      votePostalAddress: districtToEdit?.votePostalAddress || "",
    },
  });

  const { isPending, mutate } = useUpsertDistrictMutation();
  function onSubmit(input: DistrictSchema) {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>
            {districtToEdit ? "Update district" : "Add district"}
          </SheetTitle>
        </SheetHeader>
        <div className="max-w-xl px-3 mx-auto overflow-y-auto py-4  w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>District name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Lira City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 flex-wrap *:flex-1">
                <FormField
                  control={form.control}
                  name="voteNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Vote number</FormLabel>
                      <FormControl>
                        <NumberInput placeholder={"e.g., 606"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="votePostalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Vote postal address</FormLabel>
                      <FormControl>
                        <Input placeholder={"e.g., P.O.Box 123"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="votePhysicalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Vote physical address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"e.g., Block 123 Main St Block 2"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {districtToEdit ? "Update district" : "Add district"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
