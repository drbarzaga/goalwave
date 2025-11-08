"use client";

import React from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/shared/google-button";

export default function SignUpForm() {
  return (
    <form
      action=""
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div className="text-center">
          <Link href="/" aria-label="go home" className="mx-auto block w-fit">
            <LogoIcon />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Create a {process.env.NEXT_PUBLIC_APP_NAME} Account
          </h1>
          <p className="text-sm">Welcome! Create an account to get started</p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="block text-sm">
                Firstname
              </Label>
              <Input type="text" required name="firstname" id="firstname" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="block text-sm">
                Lastname
              </Label>
              <Input type="text" required name="lastname" id="lastname" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email
            </Label>
            <Input type="email" required name="email" id="email" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pwd" className="text-sm">
                Password
              </Label>
            </div>
            <Input
              type="password"
              required
              name="pwd"
              id="pwd"
              className="input sz-md variant-mixed"
            />
          </div>

          <Button className="w-full">Sign Up</Button>
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
          Have an account ?
          <Button asChild variant="link" className="px-2">
            <Link href="/login">Sign In</Link>
          </Button>
        </p>
      </div>
    </form>
  );
}
