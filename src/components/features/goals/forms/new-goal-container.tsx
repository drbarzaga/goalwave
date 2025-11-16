"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewGoalForm from "./new-goal-form";
import NewGoalPreview from "./new-goal-preview";
import NewGoalTips from "../new-goal-tips";
import { NewGoalFormProvider } from "@/components/providers/new-goal-form-provider";

export default function NewGoalContainer() {
  return (
    <NewGoalFormProvider>
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
            <NewGoalForm />
          </CardContent>
        </Card>

        {/* Secondary column - Preview and Tips */}
        <div className="space-y-6 flex flex-col h-full">
          <NewGoalPreview />
          <NewGoalTips />
        </div>
      </div>
    </NewGoalFormProvider>
  );
}
