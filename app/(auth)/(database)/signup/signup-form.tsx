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
import { signUpSchema, SignUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Agreement from "../agreement";
import { signUp } from "./actions";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    values: {
      email: "",
      password: "",
      name: "",
      role: "ADMIN",
    },
  });

  async function onSubmit(values: SignUpSchema) {
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error)
        toast.error("Self registration error", {
          position: "top-center",
          description: error,
        });
    });
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="last:pt-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Jane Doe " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value!}
                    placeholder="e.g., someone@gmail.com"
                    type="email"
                  />
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
                    placeholder="your password goes here"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton loading={isPending} type="submit" className="w-full">
            Create account
          </LoadingButton>
        </form>
      </Form>
      <Agreement className="text-center mb-6" />
      <Link
        href={`/login`}
        className="block text-center group/link hover:text-primary"
      >
        <span className="underline">
          Already have an account? <strong>Login</strong>
        </span>
        <MoveRightIcon className="ms-2 group-hover/link:visible inline  invisible transition-all ease-in delay-200 " />
      </Link>
    </>
  );
}
