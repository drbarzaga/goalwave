"use client";

import { useState } from "react";
import SidebarNav from "./sidebar-nav";
import Topbar from "./topbar";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  function toggleSidebar() {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav isCollapsed={isSidebarCollapsed} />
      <main className={isSidebarCollapsed ? "flex-1 pl-16" : "flex-1 pl-64"}>
        <Topbar
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <div className="pt-16">{children}</div>
      </main>
    </div>
  );
}
