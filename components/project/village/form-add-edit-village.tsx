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
import { VillageData } from "@/lib/types";
import { villageSchema, VillageSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FieldParish from "./field-parish";
import { useUpsertVillageMutation } from "./mutation";

interface FormAddEditVillageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  villageToEdit?: VillageData;
  parishId?: string;
}
export default function FormAddEditVillage({
  open,
  setOpen,
  villageToEdit,
  parishId,
}: FormAddEditVillageProps) {
  const form = useForm<VillageSchema>({
    resolver: zodResolver(villageSchema),
    values: {
      id: villageToEdit?.id || "",
      name: villageToEdit?.name || "",
      parishId: parishId || villageToEdit?.parishId || "",
    },
  });

  const { isPending, mutate } = useUpsertVillageMutation();
  function onSubmit(input: VillageSchema) {
    mutate(
      { ...input, parishId: parishId! },
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
            {villageToEdit ? "Update village" : "Add village"}
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
                    <FormLabel required>Village name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Uhuru bar ward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FieldParish form={form} lockParishField={!!parishId} />

              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {villageToEdit ? "Update village" : "Add village"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
