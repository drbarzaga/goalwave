"use client";

import { getCompanyName, getYear } from "@/lib/utils";

export default function FooterSection() {
  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {getYear()} {getCompanyName()}, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            Made with ❤️ by the community.
          </div>
        </div>
      </div>
    </footer>
  );
}
