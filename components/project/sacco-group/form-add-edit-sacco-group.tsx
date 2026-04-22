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
import { SaccoGroupData } from "@/lib/types";
import { saccoGroupSchema, SaccoGroupSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FieldVillage from "./field-village";
import { useUpsertSaccoGroupMutation } from "./mutation";

interface FormAddEditSaccoGroupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  saccoGroupToEdit?: SaccoGroupData;
  villageId?: string;
}
export default function FormAddEditSaccoGroup({
  open,
  setOpen,
  saccoGroupToEdit,
  villageId,
}: FormAddEditSaccoGroupProps) {
  const form = useForm<SaccoGroupSchema>({
    resolver: zodResolver(saccoGroupSchema),
    values: {
      id: saccoGroupToEdit?.id || "",
      name: saccoGroupToEdit?.name || "",
      villageId: villageId || saccoGroupToEdit?.villageId || "",
    },
  });

  const { isPending, mutate } = useUpsertSaccoGroupMutation();
  function onSubmit(input: SaccoGroupSchema) {
    mutate(
      { ...input, villageId: villageId! },
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
            {saccoGroupToEdit ? "Update saccoGroup" : "Add saccoGroup"}
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
                    <FormLabel required>SaccoGroup name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Uhuru bar ward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FieldVillage form={form} lockVillageField={!!villageId} />

              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {saccoGroupToEdit ? "Update saccoGroup" : "Add saccoGroup"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
