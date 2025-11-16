import { LucideIcon } from "lucide-react";

export interface GoalCategory {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

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
