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
import { SubCountyData } from "@/lib/types";
import { subCountySchema, SubCountySchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FieldDistrict from "./field-district";
import { useUpsertSubCountyMutation } from "./mutation";

interface FormAddEditSubCountyProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  subCountyToEdit?: SubCountyData;
  districtId?: string;
}
export default function FormAddEditSubCounty({
  open,
  setOpen,
  subCountyToEdit,
  districtId,
}: FormAddEditSubCountyProps) {
  const form = useForm<SubCountySchema>({
    resolver: zodResolver(subCountySchema),
    values: {
      id: subCountyToEdit?.id || "",
      name: subCountyToEdit?.name || "",
      districtId: districtId || subCountyToEdit?.districtId || "",
    },
  });

  const { isPending, mutate } = useUpsertSubCountyMutation();
  function onSubmit(input: SubCountySchema) {
    mutate(
      { ...input, districtId: districtId! },
      {
        onSuccess() {
          setOpen(false);
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>
            {subCountyToEdit ? "Update subCounty" : "Add subCounty"}
          </SheetTitle>
        </SheetHeader>
        <div className="max-w-xl px-3 mx-auto overflow-y-auto py-4  w-full">
          <Form {...form}>
            {/* <pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>SubCounty name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Lira City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FieldDistrict form={form} lockDistrictField={!!districtId} />

              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {subCountyToEdit ? "Update subCounty" : "Add subCounty"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
