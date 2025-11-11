"use client";

import React from "react";
import { Button } from "../ui/button";
import { Spinner } from "@/components/ui/spinner";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

export default function SubmitButton({
  children,
  loading = false,
  variant = "default",
  size = "default",
  className,
  loadingText = "",
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
          <span className="ml-2">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
