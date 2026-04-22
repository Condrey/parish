import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BulkBeneficiaryUploadArray,
  BulkBeneficiaryUploadSchema,
  bulkBeneficiaryUploadSchema,
} from "@/lib/validation";
import { formatDate } from "date-fns";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormAddEditPerson from "./form-add-edit-person";
import FormattedCell from "./formatted-cell";

interface BeneficiaryItemProps extends React.ComponentProps<"div"> {
  form: UseFormReturn<BulkBeneficiaryUploadArray>;
  index: number;
  item: BulkBeneficiaryUploadSchema;
}
export default function BeneficiaryItem({
  item,
  index,
  form,
}: BeneficiaryItemProps) {
  const [open, setOpen] = useState(false);
  const {
    contact,
    createdAt,
    district,
    email,
    enterpriseGroupName,
    fullname,
    gender,
    memberId,
    nin,
    parish,
    status,
    subCounty,
    village,
    subsistence,
  } = item;
  const hasError = !bulkBeneficiaryUploadSchema.safeParse(item).success;

  return (
    <>
      <TableRow
        className={cn(
          "hover:cursor-pointer    ",
          hasError
            ? "bg-destructive/5 even:bg-destructive/10 hover:bg-destructive hover:*:text-destructive-foreground    dark:bg-destructive/5 dark:even:bg-destructive/10 dark:hover:bg-destructive dark:hover:*:text-destructive-foreground "
            : "odd:bg-muted even:bg-muted/50 hover:bg-primary hover:text-primary-foreground  dark:odd:bg-muted dark:even:bg-muted/50 dark:hover:bg-primary dark:hover:text-primary-foreground ",
        )}
        onClick={() => setOpen(true)}
      >
        <TableCell>{index + 1}</TableCell>

        <FormattedCell
          keyPair="fullname"
          value={fullname}
          label="Invalid name"
          item={item}
        />
        <FormattedCell
          keyPair="memberId"
          value={memberId}
          label="Invalid"
          item={item}
        />
        <FormattedCell
          keyPair="nin"
          value={nin}
          label="Invalid nin"
          item={item}
        />
        <FormattedCell
          keyPair="gender"
          value={gender}
          label="Invalid gender"
          item={item}
        />
        <FormattedCell
          keyPair="contact"
          value={contact}
          label="Inv. contact"
          item={item}
        />
        <FormattedCell
          keyPair="email"
          value={email}
          label="Invalid EMAIL Address"
          item={item}
        />
        <FormattedCell
          keyPair="enterpriseGroupName"
          value={enterpriseGroupName}
          label="Inv. Group name."
          item={item}
        />
        <FormattedCell
          keyPair="status"
          value={status}
          label="Invalid status"
          item={item}
        />
        <FormattedCell
          keyPair="subsistence"
          value={subsistence}
          label="Invalid SUB value"
          item={item}
        />

        <FormattedCell
          keyPair="district"
          value={district}
          label="Inv. district."
          item={item}
        />

        <FormattedCell
          keyPair="subCounty"
          value={subCounty}
          label="Inv. subCounty."
          item={item}
        />
        <FormattedCell
          keyPair="parish"
          value={parish}
          label="Invalid parish"
          item={item}
        />
        <FormattedCell
          keyPair="village"
          value={village}
          label="Invalid village"
          item={item}
        />
        <FormattedCell
          keyPair="createdAt"
          value={formatDate(createdAt!, "MM/dd/yyyy")}
          label="Invalid CREcreatedAt"
          item={item}
        />
      </TableRow>
      <FormAddEditPerson
        open={open}
        setOpen={setOpen}
        item={item}
        form={form}
        index={index}
      />
    </>
  );
}
