import { createGoalFormSchema } from "@/lib/validations/goals";
import { LucideIcon } from "lucide-react";
import z from "zod";

// Type for the goal category
export interface GoalCategory {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Type for the goal form data
export interface GoalFormData {
  title: string;
  description: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  date: Date | undefined;
  priority: string;
  savingFrequency: string;
  reminderEnabled: boolean;
}

// Type for the create goal form data
export type CreateGoalFormData = z.infer<typeof createGoalFormSchema>;

// Type for a goal in the UI (after transformation from DB)
export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: "active" | "inactive" | "completed" | "cancelled";
};
