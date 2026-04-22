import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BulkBeneficiaryUploadArray } from "@/lib/validation";
import { AlertTriangleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import ButtonAddEditBeneficiary from "../button-add-edit-beneficiary";
import BeneficiaryItem from "./beneficiary-item";
import ButtonAddPerson from "./button-add-person";

interface TableManyBeneficiariesProps {
  filename: string;
  form: UseFormReturn<BulkBeneficiaryUploadArray>;
  setFileToUpload: Dispatch<SetStateAction<File | null>>;
}
export default function TableManyBeneficiaries({
  form,
  filename,
  setFileToUpload,
}: TableManyBeneficiariesProps) {
  const watchedBeneficiaries = form.watch("beneficiaries");
  const hasErrors = !!form.formState.errors.beneficiaries?.length;

  return (
    <Table className="caption-top bg-card border p-2">
      <TableCaption className=" border   w-full">
        <div className="justify-start items-center gap-0.5 py-2.5 flex mx-auto max-w-7xl w-full">
          <h1 className="flex-1">
            <span className="text-foreground">Uploaded file: </span>
            {filename}
          </h1>
          <Button
            type="button"
            size="sm"
            variant={"destructive"}
            onClick={() => {
              form.setValue("beneficiaries", []);
              form.clearErrors();
              setFileToUpload(null);
            }}
          >
            <TrashIcon />
            Clear table
          </Button>
          <ButtonAddPerson
            formValue={form}
            type="button"
            size={"sm"}
            variant={"default"}
          >
            <PlusIcon />
            Add staff
          </ButtonAddPerson>
        </div>
        {hasErrors && (
          <div className="bg-destructive block  px-3 py-2 text-destructive-foreground">
            <AlertTriangleIcon className="mr-1 size-4 inline" /> Clear these
            errors before submission, submit again after clearing
          </div>
        )}
      </TableCaption>
      <TableHeader className="bg-secondary">
        <TableRow>
          <TableHead>S/n</TableHead>
          <TableHead>FULL NAME</TableHead>
          <TableHead>MEMBER ID</TableHead>
          <TableHead>NIN</TableHead>
          <TableHead>M/F</TableHead>
          <TableHead>CONTACT</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>GROUP</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>SUBSISTENCE</TableHead>
          <TableHead>DISTRICT</TableHead>
          <TableHead>SUB-COUNTY</TableHead>
          <TableHead>PARISH</TableHead>
          <TableHead>VILLAGE</TableHead>
          <TableHead>CREATED AT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-muted text-muted-foreground">
          <TableCell>e.g., 1</TableCell>
          <TableCell>Wacha Godfrey</TableCell>
          <TableCell>7694305269</TableCell>
          <TableCell>CM570221050APQ</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2567********</TableCell>
          <TableCell>wachagodfrey@example.com</TableCell>
          <TableCell>Woro en ryeko Group</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Yes</TableCell>
          <TableCell>Lira City</TableCell>
          <TableCell>Lira City West Division</TableCell>
          <TableCell>Jinja Camp Ward</TableCell>
          <TableCell>Smart way Cell</TableCell>
          <TableCell>dd/mm/yyyy</TableCell>
        </TableRow>
        {/* {beneficiaries.map((item, index) => (
          <BeneficiaryItem key={item.sn} item={item} index={index} form={form} />
        ))} */}
        {watchedBeneficiaries.map((item, index) => (
          <BeneficiaryItem
            key={item.sn}
            item={item}
            index={index}
            form={form}
          />
        ))}
      </TableBody>
    </Table>
  );
}
