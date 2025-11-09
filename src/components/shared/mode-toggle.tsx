"use client";

import * as React from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useThemeAnimation } from "@space-man/react-theme-animation";

import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, toggleTheme, ref } = useThemeAnimation();

  return (
    <Button
      ref={ref}
      variant="ghost"
      className="group/toggle h-8 w-8 px-0 cursor-pointer"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon className="[html.dark_&]:block" />
      ) : (
        <MoonIcon className="[html.light_&]:block" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
