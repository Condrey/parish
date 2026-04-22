"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { emailSchema, EmailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  checkIsEmailVerified,
  resendEmailVerificationLink,
  sendWelcomingRemarks,
} from "./action";

export default function EmailVerificationForm({ email }: { email: string }) {
  const searchParams = useSearchParams();
  const loginRedirectUrl =
    searchParams.get(REDIRECT_TO_URL_SEARCH_PARAMS) || "/";

  const [error, setError] = useState<string>();
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    values: { email },
  });
  const { data, isRefetching } = useQuery({
    queryKey: ["isEmailVerified"],
    queryFn: async () => checkIsEmailVerified(email),
    refetchInterval: 10000,
  });

  if (data) {
    sendWelcomingRemarks(email, loginRedirectUrl);
  }
  async function handleEmailResend(input: EmailSchema) {
    const { error } = await resendEmailVerificationLink(
      input.email,
      loginRedirectUrl,
    );
    if (error) {
      setError(error);
    }
    toast.success("Verification link sent successfully.");
  }
  return (
    <div className="flex size-full min-h-dvh flex-col justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>A verification link has been sent.</CardTitle>
          <CardDescription>
            Please check your email for the link. If you did not receive it,
            please tap on the resend verification link button below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEmailResend)}
              className="space-y-4"
            >
              {error && (
                <Badge variant={"destructive"} className="w-full">
                  {error}
                </Badge>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>You email</FormLabel>
                    <FormControl>
                      <Input placeholder="email goes here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={form.formState.isSubmitting}
                className="w-full"
              >
                Resend Verification Link
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
        {
          <CardFooter
            className={cn(
              "text-xs text-muted-foreground",
              isRefetching ? "visible" : "invisible",
            )}
          >
            <LoaderIcon className="mr-2 size-4 animate-spin" /> checking for
            token verification
          </CardFooter>
        }
      </Card>
    </div>
  );
}
