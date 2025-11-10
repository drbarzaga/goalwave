"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { GoalIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/shared/mode-toggle";
import GitHubStarsButton from "@/components/shared/github-stars-button";
import { authClient } from "@/lib/auth-client";

const menuItems: { name: string; href: string }[] = [
  // { name: "Home", href: "/" },
  // { name: "Features", href: "#features" },
  // { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuState, setMenuState] = useState(false);

  const { data: session } = authClient.useSession();

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
      >
        <div className="m-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:pr-4">
                <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <GitHubStarsButton size="sm" />

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                <ModeToggle />
                {session ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">
                      <span className="flex items-center">
                        <GoalIcon className="size-4 mr-2" />
                        Your Dashboard
                      </span>
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/signup">
                        <span>Signup</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
