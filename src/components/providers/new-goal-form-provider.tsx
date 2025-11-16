"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { GoalFormData } from "@/types/goals";

interface NewGoalFormContextValue {
  formData: GoalFormData;
  updateFormData: (updates: Partial<GoalFormData>) => void;
}

const NewGoalFormContext = createContext<NewGoalFormContextValue | undefined>(
  undefined
);

const initialFormData: GoalFormData = {
  title: "",
  description: "",
  category: "",
  targetAmount: "0",
  currentAmount: "0",
  date: undefined,
  priority: "",
  savingFrequency: "monthly",
  reminderEnabled: false,
};

interface NewGoalFormProviderProps {
  readonly children: React.ReactNode;
}

export function NewGoalFormProvider({ children }: NewGoalFormProviderProps) {
  const [formData, setFormData] = useState<GoalFormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<GoalFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(
    () => ({ formData, updateFormData }),
    [formData, updateFormData]
  );

  return (
    <NewGoalFormContext.Provider value={value}>
      {children}
    </NewGoalFormContext.Provider>
  );
}

export function useNewGoalForm() {
  const context = useContext(NewGoalFormContext);
  if (context === undefined) {
    throw new Error("useNewGoalForm must be used within a NewGoalFormProvider");
  }
  return context;
}
