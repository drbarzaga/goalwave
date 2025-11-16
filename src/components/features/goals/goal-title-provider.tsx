"use client";

import { useEffect } from "react";

interface GoalTitleProviderProps {
  readonly goalId: string;
  readonly goalTitle: string;
  readonly children: React.ReactNode;
}

export function GoalTitleProvider({
  goalId,
  goalTitle,
  children,
}: GoalTitleProviderProps) {
  useEffect(() => {
    // Store goal title in localStorage for breadcrumb
    if (typeof window !== "undefined") {
      localStorage.setItem(`goal-title-${goalId}`, goalTitle);
    }
  }, [goalId, goalTitle]);

  return <>{children}</>;
}

