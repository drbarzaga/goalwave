"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ArrowUpDown } from "lucide-react";
import { calculateProgress, getProgressColor } from "@/lib/goals-helpers";
import { GOAL_CATEGORIES } from "@/lib/constants";

interface GoalProgressCardProps {
  readonly title: string;
  readonly description?: string;
  readonly category: string; // category value (e.g., "emergency", "travel")
  readonly currentAmount: number;
  readonly targetAmount: number;
  readonly onAddFunds: () => void;
}

function CategoryIcon({
  category,
  className,
}: {
  readonly category: string;
  readonly className?: string;
}) {
  const categoryConfig = GOAL_CATEGORIES.find((cat) => cat.value === category);

  if (categoryConfig) {
    const Icon = categoryConfig.icon;
    return <Icon className={className} />;
  }

  return <DollarSign className={className} />;
}

function getCategoryConfig(category: string) {
  const categoryConfig = GOAL_CATEGORIES.find((cat) => cat.value === category);
  return categoryConfig || GOAL_CATEGORIES[GOAL_CATEGORIES.length - 1]; // Default to "other"
}

export function GoalProgressCard({
  title,
  description,
  category,
  currentAmount,
  targetAmount,
  onAddFunds,
}: GoalProgressCardProps) {
  const progress = calculateProgress(currentAmount, targetAmount);
  const remaining = Math.max(0, targetAmount - currentAmount);
  const categoryConfig = getCategoryConfig(category);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${categoryConfig.bgColor} flex items-center justify-center`}
          >
            <CategoryIcon
              category={category}
              className={`w-6 h-6 ${categoryConfig.color}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
            <div className="mt-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {categoryConfig.label}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Has ahorrado ${currentAmount.toLocaleString()} de tu meta de $
            {targetAmount.toLocaleString()}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-lg font-semibold min-w-[3rem] text-right">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Actual</p>
            <p className="text-lg font-semibold">
              ${currentAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Meta</p>
            <p className="text-lg font-semibold">
              ${targetAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Restante</p>
            <p className="text-lg font-semibold">
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <Button onClick={onAddFunds} className="w-full" size="lg">
          <ArrowUpDown className="w-4 h-4" />
          Nueva Transacción
        </Button>
      </CardContent>
    </Card>
  );
}
