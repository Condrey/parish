"use client";

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
import { PasswordInput } from "@/components/ui/password-input";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { loginSchema, LoginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "./actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const loginRedirectUrl =
    searchParams.get(REDIRECT_TO_URL_SEARCH_PARAMS) || "/";

  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    values: {
      password: "",
      username: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    startTransition(async () => {
      const { error } = await loginAction(values!, loginRedirectUrl);
      if (error) {
        toast.error("LOGIN ERROR", {
          position: "top-center",
          description: error,
        });
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="last:pt-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/ username</FormLabel>
              <FormControl>
                <Input placeholder="e.g., someone@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="type here your password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
        <Link
          // eslint-disable-next-line react-hooks/incompatible-library
          href={`/forgot-password/${form.watch("username")}?user=applicant`}
          className="block text-center underline group/link hover:text-primary"
        >
          <span>Forgot your password?</span>
          <MoveRightIcon className="inline group-hover/link:visible transition-all ease-linear delay-200 ms-2 invisible  " />
        </Link>
      </form>
    </Form>
  );
}
