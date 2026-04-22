/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { passwordResetSchema, PasswordResetSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPasswordAndLogin, validateEmail, verifyOtp } from "./action";
import ButtonResendToken from "./button-resend-token";
import SectionSubmitEmailUsername from "./section-submit-email-username";
import SectionSubmitOtp from "./section-submit-otp";
import SectionSubmitPassword from "./section-submit-password";

interface Props {
  emailUsername: string | null | undefined;
  isValidEmail: boolean;
}

export default function FormRequestReset({
  emailUsername,
  isValidEmail,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(isValidEmail ? 2 : 1);
  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      emailUsername: emailUsername || "",
      newPassword: "",
      repeatPassword: "",
      otp: "",
    },
  });

  function submit(input: PasswordResetSchema, event?: any) {
    const submitter = event?.nativeEvent?.submitter;
    const action = submitter?.value;

    startTransition(async () => {
      let result;
      if (action === "step-1") {
        result = await validateEmail({ input });
        if (!result.error) {
          setStep(2);
          toast.success(
            "A request to rest the password has been successfully sent",
          );
          router.push(`/forgot-password/${emailUsername}?isValidEmail=yes`);
        } else {
          toast.error(result.error);
        }
      } else if (action === "step-2") {
        result = await verifyOtp({ input });
        if (!result.error) {
          setStep(3);
          toast.success("OTP verified, now reset your password");
        } else {
          toast.error(result.error);
        }
      } else if (action === "step-3") {
        result = await resetPasswordAndLogin({ input });
        if (!result.error) {
          router.push("/");
        } else {
          toast.error(result.error);
        }
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Resetting password for {emailUsername}</CardTitle>
        <CardDescription className="text-muted-foreground ">
          {step === 1
            ? "To request a password reset token, please enter your email or username below"
            : step === 2
              ? "Enter the verification code that was sent to your email. If you no longer have access to this email, contact the administrators for further assistance."
              : "You are almost done, enter a new password and repeat it in the next field."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className=" w-full space-y-4"
          >
            {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
            {step === 1 && <SectionSubmitEmailUsername form={form} />}
            {step === 2 && <SectionSubmitOtp form={form} />}
            {step === 3 && <SectionSubmitPassword form={form} />}
            <div className="justify-between flex gap-3 items-center">
              {step === 1 && (
                <LoadingButton value="step-1" name="action" loading={isPending}>
                  Request Reset
                </LoadingButton>
              )}
              {step === 2 && (
                <>
                  <ButtonResendToken form={form} />
                  <LoadingButton
                    value="step-2"
                    name="action"
                    loading={isPending}
                  >
                    Submit OTP
                  </LoadingButton>
                </>
              )}
              {step === 3 && (
                <LoadingButton value="step-3" name="action" loading={isPending}>
                  Reset Password
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
