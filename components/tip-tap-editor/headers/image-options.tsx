import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormActions,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { singleContentSchema, SingleContentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tiptap/react";
import { ImageIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function ImageOptions({ editor }: { editor: Editor }) {
  const [isPending, startTransition] = useTransition();
  const [_, setOpen] = useState(false);
  const form = useForm<SingleContentSchema>({
    resolver: zodResolver(singleContentSchema),
    defaultValues: {
      singleContent: "",
    },
  });
  function handleSubmit(input: SingleContentSchema) {
    startTransition(() => {
      editor
        .chain()
        .focus()
        .setImage({ src: input.singleContent, alt: "url image" })
        .run();
      setOpen(false);
    });
  }
  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <ImageIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" capitalize">Add an image</DialogTitle>
          <DialogDescription>
            Either add an image from the computer or from an online url
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="singleContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder="enter the online url here" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormActions>
              <LoadingButton
                type="button"
                loading={isPending}
                onClick={() => form.handleSubmit(handleSubmit)()}
              >
                Add Image
              </LoadingButton>
            </FormActions>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
