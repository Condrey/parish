import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BulkBeneficiaryUploadSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<BulkBeneficiaryUploadSchema>;
}
export default function FieldStatus({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Status</FormLabel>
          <Select
            defaultValue={field.value}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose a status"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed statuses</SelectLabel>
                {["Active", "Inactive"].map((status) => {
                  return (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
