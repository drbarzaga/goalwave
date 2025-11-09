"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/");
  };
  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
