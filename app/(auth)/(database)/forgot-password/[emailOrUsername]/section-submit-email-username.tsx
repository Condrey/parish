import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordResetSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";
interface Props {
  form: UseFormReturn<PasswordResetSchema>;
}
export default function SectionSubmitEmailUsername({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="emailUsername"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email/ username</FormLabel>
          <FormControl>
            <Input
              placeholder="enter your username or email"
              type="email"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
