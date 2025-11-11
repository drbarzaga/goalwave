"use client";

import React, { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/shared/google-button";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { getCompanyName } from "@/lib/utils";
import { ActionResult } from "@/types/core";
import { SignUpSchema } from "@/types/auth";
import { actions } from "@/actions";
import SubmitButton from "@/components/shared/submit-button";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";

const INITIAL_STATE: ActionResult<SignUpSchema> = {
  data: {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  },
  success: false,
  message: undefined,
  fieldErrors: {},
};

export default function SignUpForm() {
  const [formState, formAction, isPending] = useActionState(
    actions.auth.signUp,
    INITIAL_STATE
  );

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    setError,
    clearErrors,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      firstname: formState.data?.firstname ?? "",
      lastname: formState.data?.lastname ?? "",
      email: formState.data?.email ?? "",
      password: "",
    },
  });

  async function handleGoogleSignUp() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google Sign-Up error:", error);
      toast.error("Failed to sign up with Google.");
    }
  }

  function onSubmit(data: SignUpSchema) {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
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
          setError(field as keyof SignUpSchema, {
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
  }, [formState]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div className="text-center">
          <Link href="/" aria-label="go home" className="mx-auto block w-fit">
            <LogoIcon />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Create a {getCompanyName()} Account
          </h1>
          <p className="text-sm">Welcome! Create an account to get started</p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Field>
                <FieldLabel htmlFor="firstname">First name</FieldLabel>
                <Input
                  type="text"
                  required
                  id="firstname"
                  disabled={isPending}
                  defaultValue={formState.data?.firstname ?? ""}
                  {...register("firstname")}
                  aria-invalid={!!clientErrors.firstname}
                />
                <FieldError>
                  {clientErrors.firstname?.message ||
                    formState.fieldErrors?.firstname?.[0]?.toString()}
                </FieldError>
              </Field>
            </div>
            <div className="space-y-2">
              <Field>
                <FieldLabel htmlFor="lastname">Last name</FieldLabel>
                <Input
                  type="text"
                  required
                  id="lastname"
                  disabled={isPending}
                  defaultValue={formState.data?.lastname ?? ""}
                  {...register("lastname")}
                  aria-invalid={!!clientErrors.lastname}
                />
                <FieldError>
                  {clientErrors.lastname?.message ||
                    formState.fieldErrors?.lastname?.[0]?.toString()}
                </FieldError>
              </Field>
            </div>
          </div>

          <div className="space-y-2">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                required
                id="email"
                disabled={isPending}
                defaultValue={formState.data?.email ?? ""}
                {...register("email")}
                aria-invalid={!!clientErrors.email}
              />
              <FieldError>
                {clientErrors.email?.message ||
                  formState.fieldErrors?.email?.[0]?.toString()}
              </FieldError>
            </Field>
          </div>

          <div className="space-y-0.5">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                type="password"
                required
                id="password"
                disabled={isPending}
                defaultValue={formState.data?.password ?? ""}
                {...register("password")}
                aria-invalid={!!clientErrors.password}
              />
              <FieldError>
                {clientErrors.password?.message ||
                  formState.fieldErrors?.password?.[0]?.toString()}
              </FieldError>
            </Field>
          </div>

          <SubmitButton className="w-full" loading={isPending}>
            Sign Up
          </SubmitButton>
        </div>

        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <hr className="border-dashed" />
          <span className="text-muted-foreground text-xs">
            Or continue With
          </span>
          <hr className="border-dashed" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <GoogleButton onClick={handleGoogleSignUp} />
        </div>
      </div>

      <div className="p-3">
        <p className="text-accent-foreground text-center text-sm">
          Have an account ?
          <Button asChild variant="link" className="px-2">
            <Link href="/login">Sign In</Link>
          </Button>
        </p>
      </div>
    </form>
  );
}
