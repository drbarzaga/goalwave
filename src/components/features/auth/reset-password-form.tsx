"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetFormPassword() {
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
          <h1 className="mb-1 mt-4 text-xl font-semibold">Reset Password</h1>
          <p className="text-sm">
            Enter your new password to reset your password.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              New Password
            </Label>
            <Input
              type="email"
              required
              name="email"
              id="email"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Confirm New Password
            </Label>
            <Input
              type="email"
              required
              name="email"
              id="email"
              placeholder="name@example.com"
            />
          </div>

          <Button className="w-full">Reset Password</Button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-accent-foreground text-center text-sm">
          Back to Sign In?
          <Button asChild variant="link" className="px-2">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </p>
      </div>
    </form>
  );
}
