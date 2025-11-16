"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoalProgressCard } from "./goal-progress-card";
import { TransactionsHistoryCard } from "./transactions-history-card";
import { GoalInfoCard } from "./goal-info-card";
import { GoalActionsCard } from "./goal-actions-card";
import { TransactionModal } from "./transaction-modal";

interface Transaction {
  readonly id: string;
  readonly type: "deposit" | "withdrawal";
  readonly amount: number;
  readonly date: string;
  readonly description?: string;
}

interface GoalDetailsContentProps {
  readonly goalId: string;
  readonly title: string;
  readonly description?: string;
  readonly category: string;
  readonly currentAmount: number;
  readonly targetAmount: number;
  readonly deadline?: string;
  readonly createdAt: string;
  readonly totalTransactions: number;
  readonly transactions: Transaction[];
}

export function GoalDetailsContent({
  goalId,
  title,
  description,
  category,
  currentAmount: initialCurrentAmount,
  targetAmount,
  deadline,
  createdAt,
  totalTransactions,
  transactions,
}: GoalDetailsContentProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(initialCurrentAmount);

  // Update currentAmount when prop changes (after refresh)
  useEffect(() => {
    setCurrentAmount(initialCurrentAmount);
  }, [initialCurrentAmount]);

  const handleAddFunds = () => {
    setIsModalOpen(true);
  };

  const handleTransactionSuccess = () => {
    // Refresh the page data without full reload
    router.refresh();
    // Optimistically update currentAmount based on last transaction
    // This will be corrected when router.refresh() completes
  };

  const handleEdit = () => {
    console.log("Edit clicked");
    // TODO: Implement edit logic
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    // TODO: Implement delete logic
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <GoalProgressCard
          title={title}
          description={description}
          category={category}
          currentAmount={currentAmount}
          targetAmount={targetAmount}
          onAddFunds={handleAddFunds}
        />

        <TransactionsHistoryCard transactions={transactions} />
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        <GoalInfoCard
          deadline={deadline}
          createdAt={createdAt}
          totalTransactions={totalTransactions}
        />

        <GoalActionsCard onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <TransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        goalId={goalId}
        currentAmount={currentAmount}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}

