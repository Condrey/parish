import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordResetSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";
interface Props {
  form: UseFormReturn<PasswordResetSchema>;
}
export default function SectionSubmitPassword({ form }: Props) {
  return (
    <>
      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="enter new password"
                type="password"
                autoComplete="new-password"
                {...field}
                value={field.value!}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="repeatPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repeat Password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="repeat the above password"
                type="password"
                {...field}
                value={field.value!}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
