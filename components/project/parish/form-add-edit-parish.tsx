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
import { ParishData } from "@/lib/types";
import { parishSchema, ParishSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FieldSubCounty from "./field-sub-county";
import { useUpsertParishMutation } from "./mutation";

interface FormAddEditParishProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parishToEdit?: ParishData;
  subCountyId?: string;
}
export default function FormAddEditParish({
  open,
  setOpen,
  parishToEdit,
  subCountyId,
}: FormAddEditParishProps) {
  const form = useForm<ParishSchema>({
    resolver: zodResolver(parishSchema),
    values: {
      id: parishToEdit?.id || "",
      name: parishToEdit?.name || "",
      subCountyId: subCountyId || parishToEdit?.subCountyId || "",
    },
  });

  const { isPending, mutate } = useUpsertParishMutation();
  function onSubmit(input: ParishSchema) {
    mutate(
      { ...input, subCountyId: subCountyId! },
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
            {parishToEdit ? "Update parish" : "Add parish"}
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
                    <FormLabel required>Parish name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Uhuru bar ward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FieldSubCounty form={form} lockSubCountyField={!!subCountyId} />

              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {parishToEdit ? "Update parish" : "Add parish"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
