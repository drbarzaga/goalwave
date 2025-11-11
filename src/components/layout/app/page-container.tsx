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
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
