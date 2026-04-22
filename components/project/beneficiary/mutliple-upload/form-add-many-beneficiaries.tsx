/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@/components/ui/form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { District } from "@/lib/generated/prisma/client";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";
import {
  BulkBeneficiaryUploadArray,
  bulkBeneficiaryUploadArraySchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, FileIcon, UploadIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useInsertManyBeneficiariesMutation } from "../mutation";
import TableManyBeneficiaries from "./table-many-beneficiaries";
import { parseFlexibleDate } from "./utility";

interface FormAddManyBeneficiariesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  district: District;
}

export function FormAddManyBeneficiaries({
  open,
  setOpen,
  district,
}: FormAddManyBeneficiariesProps) {
  const [isDownloading, startDownloadTransition] = useTransition();
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const workerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);

  const form = useForm<BulkBeneficiaryUploadArray>({
    resolver: zodResolver(bulkBeneficiaryUploadArraySchema),
    values: { beneficiaries: [] },
  });
  const watchedBeneficiaries = form.watch("beneficiaries");
  const hasErrors = !!form.formState.errors.beneficiaries?.length;
  const worker = new Worker(new URL("./excel-worker.ts", import.meta.url));

  function cancelParsing() {
    workerRef.current?.postMessage({ type: "CANCEL" });
  }

  function onFileSelected(file: File | undefined) {
    if (!file) return;

    setFileToUpload(file);
    setIsParsing(true);
    setProgress(0);

    workerRef.current = worker;

    worker.postMessage({
      type: "PARSE",
      file,
    });

    worker.onmessage = (e) => {
      const { type, progress, data, error } = e.data;

      if (type === "PROGRESS") {
        setProgress(progress);
      }

      if (type === "DONE") {
        setIsParsing(false);

        // optional: parse dates here safely
        const parsed = data.map((item: any) => ({
          ...item,
          createdAt: parseFlexibleDate(item.createdAt),
        }));

        form.setValue("beneficiaries", parsed);
        worker.terminate();
      }

      if (type === "ERROR") {
        setIsParsing(false);
        console.error(error);
        toast.error("Failed to process file");
        worker.terminate();
      }

      if (type === "CANCELLED") {
        setIsParsing(false);
        worker.terminate();
      }
    };
  }

  function downloadXLSXTemplate() {
    startDownloadTransition(async () => {
      await kyInstance
        .post("/api/sheet/many-beneficiaries", {
          body: JSON.stringify({ district: district.name }),
        })
        .then(async (response) => {
          const blob = response.blob();
          const url = window.URL.createObjectURL(await blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "beneficiaries-template.xlsx";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
    });
  }

  const { isPending, mutate } = useInsertManyBeneficiariesMutation();

  function onSubmit(input: BulkBeneficiaryUploadArray) {
    if (hasErrors) {
      toast.error("Form validation errors", {
        description: "Correct the errors before submitting.",
      });
    }
    toast.success("sib");
    mutate(
      { districtId: district.id, beneficiaries: input },
      {
        onSuccess() {
          setOpen(false);
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetContent side="top" className="h-svh overflow-y-scroll scroll-auto">
        <SheetHeader className="">
          <SheetTitle>Add many beneficiaries to {district.name}</SheetTitle>
        </SheetHeader>
        <div className="px-3 space-y-6 ">
          <Item variant={"outline"} className="max-w-3xl mx-auto">
            <ItemContent>
              <ItemTitle>Download the CSV template document</ItemTitle>
              <ItemDescription>
                Do not change the name of the fields on the template. Leave it
                as it is.
              </ItemDescription>
            </ItemContent>

            <ItemActions>
              <LoadingButton
                type="button"
                loading={isDownloading}
                variant={!watchedBeneficiaries.length ? "default" : "secondary"}
                onClick={downloadXLSXTemplate}
              >
                <DownloadIcon className="mr-2" /> Download
              </LoadingButton>
            </ItemActions>
          </Item>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full mx-auto"
            >
              {fileToUpload && (
                <div className="max-w-7xl mx-auto w-full flex justify-end">
                  <LoadingButton
                    type="button"
                    size={"lg"}
                    loading={isPending}
                    disabled={hasErrors}
                    onClick={() => form.handleSubmit(onSubmit)()}
                    className="max-w-fit"
                  >
                    <UploadIcon
                      className={cn(
                        "mr-2 transition-all",
                        !hasErrors && "animate-pulse",
                      )}
                    />
                    Upload sheet
                  </LoadingButton>
                </div>
              )}
              {isParsing && (
                <div className="space-y-2">
                  <p>Processing... {progress}%</p>
                  <button onClick={cancelParsing}>Cancel</button>
                </div>
              )}
              {!!watchedBeneficiaries.length && (
                <TableManyBeneficiaries
                  filename={fileToUpload?.name || "file"}
                  setFileToUpload={setFileToUpload}
                  form={form}
                />
              )}

              {!watchedBeneficiaries.length && (
                <div className="max-w-4xl group/upload-area  mx-auto bg-muted p-3 flex  rounded-2xl w-full h-56">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => onFileSelected(e.target.files?.[0])}
                    className="sr-only hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className=" flex flex-col  justify-center items-center  border-2 border-dashed  rounded-2xl size-full hover:cursor-pointer hover:border-primary transition-colors"
                  >
                    {!fileToUpload ? (
                      <FileIcon
                        className={cn(
                          "mr-2 size-20",
                          !fileToUpload &&
                            "fill-muted-foreground text-primary-foreground animate-pulse",
                          "group-hover/upload-area:fill-green-700",
                        )}
                        strokeWidth={0.5}
                      />
                    ) : (
                      <Spinner
                        className={cn("mr-2 size-20")}
                        strokeWidth={0.5}
                      />
                    )}
                    <span className="text-muted-foreground group-hover/upload-area:text-primary transition-colors">
                      {!fileToUpload
                        ? " choose an excel(.xlxs) file "
                        : fileToUpload.name}
                    </span>
                  </button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
