import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PasswordResetSchema } from "@/lib/validation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { UseFormReturn } from "react-hook-form";
interface Props {
  form: UseFormReturn<PasswordResetSchema>;
}
export default function SectionSubmitOtp({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="otp"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="otp-verification">Verification code</FormLabel>
          </div>
          <FormControl>
            <InputOTP
              maxLength={6}
              id="otp-verification"
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              autoComplete="one-time-code"
              required
              {...field}
              value={field.value!}
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
