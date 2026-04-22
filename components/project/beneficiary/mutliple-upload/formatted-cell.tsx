import { TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BulkBeneficiaryUploadSchema,
  bulkBeneficiaryUploadSchema,
} from "@/lib/validation";

export default function FormattedCell({
  keyPair,
  value,
  label,
  item,
}: {
  keyPair: keyof BulkBeneficiaryUploadSchema;
  value: string | undefined | number | null;
  label: string;
  item: BulkBeneficiaryUploadSchema;
}) {
  const errorMessages = bulkBeneficiaryUploadSchema
    .safeParse(item)
    .error?.flatten().fieldErrors;
  function getErrorMessage(field: keyof BulkBeneficiaryUploadSchema) {
    return errorMessages?.[field]?.[0] || "";
  }
  function fieldHasError(field: keyof BulkBeneficiaryUploadSchema) {
    return Boolean(errorMessages?.[field]);
  }

  return (
    <>
      {fieldHasError(keyPair) ? (
        <Tooltip>
          <TooltipTrigger className="text-destructive" asChild>
            <TableCell className="slashed-zero"> {value || label}</TableCell>
          </TooltipTrigger>
          <TooltipContent>
            <span>{getErrorMessage(keyPair)}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        <TableCell className="slashed-zero">{value}</TableCell>
      )}
    </>
  );
}
