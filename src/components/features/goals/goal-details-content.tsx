"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoalProgressCard } from "./goal-progress-card";
import { TransactionsHistoryCard } from "./transactions-history-card";
import { GoalInfoCard } from "./goal-info-card";
import { GoalActionsCard } from "./goal-actions-card";
import { TransactionModal } from "./transaction-modal";
import { EditGoalModal } from "./edit-goal-modal";
import { DeleteGoalDialog } from "./delete-goal-dialog";

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
  readonly priority?: string;
  readonly savingFrequency: string;
  readonly reminderEnabled: boolean;
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
  priority,
  savingFrequency,
  reminderEnabled,
}: GoalDetailsContentProps) {
  const router = useRouter();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(initialCurrentAmount);

  // Update currentAmount when prop changes (after refresh)
  useEffect(() => {
    setCurrentAmount(initialCurrentAmount);
  }, [initialCurrentAmount]);

  const handleAddFunds = () => {
    setIsTransactionModalOpen(true);
  };

  const handleTransactionSuccess = () => {
    // Refresh the page data without full reload
    router.refresh();
    // Optimistically update currentAmount based on last transaction
    // This will be corrected when router.refresh() completes
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    // Navigation is handled in DeleteGoalDialog
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
          reminderEnabled={reminderEnabled}
        />

        <GoalActionsCard onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <TransactionModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        goalId={goalId}
        currentAmount={currentAmount}
        onSuccess={handleTransactionSuccess}
      />

      <EditGoalModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        goalId={goalId}
        initialData={{
          title,
          description,
          category,
          targetAmount,
          currentAmount,
          deadline,
          priority,
          savingFrequency,
          reminderEnabled,
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteGoalDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        goalId={goalId}
        goalTitle={title}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

