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
export default function FieldGender({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Gender</FormLabel>
          <Select
            defaultValue={field.value}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose a gender"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed genders</SelectLabel>
                {["M", "F"].map((gender) => {
                  return (
                    <SelectItem key={gender} value={gender}>
                      {gender}
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
