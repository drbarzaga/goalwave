import React from "react";
import { redirect } from "next/navigation";
import { actions } from "@/actions";
import { GoalTitleProvider } from "@/components/features/goals/goal-title-provider";
import { GoalDetailsContent } from "@/components/features/goals/goal-details-content";

interface GoalDetailsPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function GoalDetailsPage({
  params,
}: GoalDetailsPageProps) {
  const { id } = await params;

  // Get goal details
  const goalResult = await actions.goals.getById(id);

  if (
    !goalResult.success ||
    !goalResult.data ||
    typeof goalResult.data !== "object" ||
    !("title" in goalResult.data)
  ) {
    redirect("/goals");
  }

  const goalData = goalResult.data as {
    id: string;
    title: string;
    description?: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    createdAt: string;
    status: string;
    priority?: string;
    savingFrequency: string;
    reminderEnabled: boolean;
  };
  const goalTitle = goalData.title;

  // Get transactions
  const transactionsResult = await actions.goals.getTransactions(id);
  const transactions =
    transactionsResult.success &&
    transactionsResult.data &&
    typeof transactionsResult.data === "object" &&
    "transactions" in transactionsResult.data
      ? (transactionsResult.data.transactions as Array<{
          id: string;
          type: "deposit" | "withdrawal";
          amount: number;
          date: string;
          description?: string;
        }>)
      : [];

  return (
    <GoalTitleProvider goalId={id} goalTitle={goalTitle}>
      <div className="space-y-6">
        {/* Main Content - Two Column Layout */}
        <GoalDetailsContent
          goalId={id}
          title={goalData.title}
          description={goalData.description}
          category={goalData.category}
          currentAmount={goalData.currentAmount}
          targetAmount={goalData.targetAmount}
          deadline={goalData.deadline}
          createdAt={goalData.createdAt}
          totalTransactions={transactions.length}
          transactions={transactions}
          priority={goalData.priority}
          savingFrequency={goalData.savingFrequency}
          reminderEnabled={goalData.reminderEnabled}
          status={goalData.status}
        />
      </div>
    </GoalTitleProvider>
  );
}
