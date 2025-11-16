"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewGoalForm, { type FormData } from "./new-goal-form";
import NewGoalPreview from "./new-goal-preview";
import NewGoalTips from "../new-goal-tips";
import { categories } from "../new-goal-types";

export default function NewGoalContainer() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    targetAmount: "",
    currentAmount: "0",
    date: undefined,
    priority: "",
    savingFrequency: "monthly",
    reminderEnabled: false,
  });

  const handleFormChange = useCallback((data: FormData) => {
    setFormData(data);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-stretch">
      {/* Main column - Form */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Información de la Meta</CardTitle>
          <CardDescription>
            Completa los detalles de tu nueva meta financiera
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <NewGoalForm
            categories={categories}
            onFormChange={handleFormChange}
          />
        </CardContent>
      </Card>

      {/* Secondary column - Preview and Tips */}
      <div className="space-y-6 flex flex-col h-full">
        <NewGoalPreview formData={formData} categories={categories} />
        <NewGoalTips />
      </div>
    </div>
  );
}
