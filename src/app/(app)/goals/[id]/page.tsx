import React from "react";
import { actions } from "@/actions";
import { GoalTitleProvider } from "@/components/features/goals/goal-title-provider";

interface GoalDetailsPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function GoalDetailsPage({
  params,
}: GoalDetailsPageProps) {
  const { id } = await params;

  // Get goal title for breadcrumb
  const result = await actions.goals.getTitle(id);
  const goalTitle =
    result.success &&
    result.data &&
    typeof result.data === "object" &&
    "title" in result.data
      ? (result.data.title as string)
      : "Detalles";

  return (
    <GoalTitleProvider goalId={id} goalTitle={goalTitle}>
      <div>
        <h1>{goalTitle}</h1>
        <p>Goal ID: {id}</p>
      </div>
    </GoalTitleProvider>
  );
}
