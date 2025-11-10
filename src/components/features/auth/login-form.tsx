"use client";

import React, { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import GoogleButton from "@/components/shared/google-button";
import SubmitButton from "@/components/shared/submit-button";
import { getCompanyName } from "@/lib/utils";
import { actions } from "@/actions";
import { ActionResult } from "@/types/core";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/types/auth";
import { signInSchema } from "@/lib/validations/auth";

const INITIAL_STATE: ActionResult<{ email: string; password: string }> = {
  data: {
    email: "",
    password: "",
  },
  success: false,
  message: undefined,
  fieldErrors: {},
};

export default function LoginForm() {
  const router = useRouter();
  const [formState, formAction, isPending] = useActionState(
    actions.auth.signIn,
    INITIAL_STATE
  );

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    setError,
    clearErrors,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: formState.data?.email ?? "",
      password: "",
    },
  });

  function onSubmit(data: SignInSchema) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  }

  useEffect(() => {
    if (formState.fieldErrors) {
      Object.entries(formState.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages[0]) {
          setError(field as keyof SignInSchema, {
            type: "server",
            message: messages[0].toString(),
          });
        }
      });
    } else {
      clearErrors();
    }
  }, [formState.fieldErrors, setError, clearErrors]);

  useEffect(() => {
    if (formState.message) {
      toast[formState.success ? "success" : "error"](formState.message);
    }

    if (formState.success) {
      router.push("/dashboard");
    }
  }, [formState, router]);

  return (
    <form
      // action={formAction}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      noValidate
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div className="text-center">
          <Link href="/" aria-label="go home" className="mx-auto block w-fit">
            <LogoIcon />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Sign In to {getCompanyName()}
          </h1>
          <p className="text-sm">Welcome back! Sign in to continue</p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                required
                id="email"
                disabled={isPending}
                {...register("email")}
                aria-invalid={!!clientErrors.email}
              />
              <FieldError>
                {/* {formState.fieldErrors?.email?.[0]?.toString()} */}
                {clientErrors.email?.message ||
                  formState.fieldErrors?.email?.[0]?.toString()}
              </FieldError>
            </Field>
          </div>

          <div className="space-y-0.5">
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/forgot-password"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                // name="password"
                id="password"
                disabled={isPending}
                // defaultValue={formState.data?.password ?? ""}
                {...register("password")}
                aria-invalid={!!clientErrors.password}
              />
              <FieldError>
                {/* {formState.fieldErrors?.password?.[0]?.toString()} */}
                {clientErrors.password?.message ||
                  formState.fieldErrors?.password?.[0]?.toString()}
              </FieldError>
            </Field>
          </div>

          <SubmitButton className="w-full">Sign In</SubmitButton>
        </div>

        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <hr className="border-dashed" />
          <span className="text-muted-foreground text-xs">
            Or continue With
          </span>
          <hr className="border-dashed" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <GoogleButton onClick={() => {}} />
        </div>
      </div>

      <div className="p-3">
        <p className="text-accent-foreground text-center text-sm">
          Don&apos;t have an account ?
          <Button asChild variant="link" className="px-2">
            <Link href="/signup">Create account</Link>
          </Button>
        </p>
      </div>
    </form>
  );
}
