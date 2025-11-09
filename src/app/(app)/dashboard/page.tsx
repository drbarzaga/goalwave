import LogoutButton from "@/components/features/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
      <Button>
        <Link href="/dashboard/settings">Settings</Link>
      </Button>
      <LogoutButton />
    </div>
  );
}
