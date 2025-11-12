"use client";

import SidebarNav from "./sidebar-nav";
import Topbar from "./topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarNav />
      <SidebarInset className="flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-auto pt-14">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
