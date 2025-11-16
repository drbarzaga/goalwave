import React, { Suspense } from "react";
import {
  GoalsStatsSectionWrapper,
  GoalsFiltersWrapper,
} from "@/components/features/goals/goals-sections";
import type { Goal } from "@/types/goals";
import {
  GoalsStatsSkeleton,
  GoalsFiltersSkeleton,
} from "@/components/features/goals/goals-skeletons";
import { actions } from "@/actions";
import {
  extractGoalsFromResult,
  getDaysUntilDeadline,
  calculateProgress,
} from "@/lib/goals-helpers";
import { PERCENTAGE_MAX, PERCENTAGE_DEFAULT } from "@/lib/constants";

export default async function GoalsPage() {
  const result = await actions.goals.get();
  const allGoals = extractGoalsFromResult(result);

  // If there are no goals, show the empty state
  if (allGoals.length === 0) {
    const activeGoals: Goal[] = [];
    const completedGoals: Goal[] = [];
    const categories: string[] = [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Mis Metas
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Administra y da seguimiento a tus objetivos financieros
          </p>
        </div>

        <Suspense fallback={<GoalsStatsSkeleton />}>
          <GoalsStatsSectionWrapper
            stats={{
              totalTarget: 0,
              totalSaved: 0,
              remaining: 0,
              totalProgress: 0,
              activeGoalsCount: 0,
              completedGoalsCount: 0,
              avgProgress: 0,
              daysUntilNearest: null,
            }}
          />
        </Suspense>

        <Suspense fallback={<GoalsFiltersSkeleton />}>
          <GoalsFiltersWrapper
            activeGoals={activeGoals}
            completedGoals={completedGoals}
            allGoals={allGoals}
            categories={categories}
          />
        </Suspense>
      </div>
    );
  }

  // Get the active and completed goals
  const activeGoals = allGoals.filter((g: Goal) => g.status === "active");
  const completedGoals = allGoals.filter((g: Goal) => g.status === "completed");

  // Get stats for the goals
  const totalTarget = allGoals.reduce(
    (sum: number, g: Goal) => sum + g.targetAmount,
    PERCENTAGE_DEFAULT
  );
  const totalSaved = allGoals.reduce(
    (sum: number, g: Goal) => sum + g.currentAmount,
    PERCENTAGE_DEFAULT
  );
  const totalProgress =
    totalTarget > PERCENTAGE_DEFAULT
      ? (totalSaved / totalTarget) * PERCENTAGE_MAX
      : PERCENTAGE_DEFAULT;
  const remaining = totalTarget - totalSaved;

  // Get the average progress of the active goals
  const avgProgress =
    activeGoals.length > 0
      ? activeGoals.reduce((sum: number, g: Goal) => {
          const progress = calculateProgress(g.currentAmount, g.targetAmount);
          return sum + progress;
        }, PERCENTAGE_DEFAULT) / activeGoals.length
      : PERCENTAGE_DEFAULT;

  // Get the nearest goal (days until deadline)
  const nearestGoal =
    activeGoals.length > 0
      ? activeGoals.reduce((nearest: Goal, current: Goal) => {
          const currentDays = getDaysUntilDeadline(current.deadline);
          const nearestDays = getDaysUntilDeadline(nearest.deadline);
          return currentDays < nearestDays ? current : nearest;
        })
      : null;

  const daysUntilNearest = nearestGoal
    ? getDaysUntilDeadline(nearestGoal.deadline)
    : null;

  const categories: string[] = Array.from(
    new Set(allGoals.map((g: Goal) => g.category))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Mis Metas
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Administra y da seguimiento a tus objetivos financieros
        </p>
      </div>

      <Suspense fallback={<GoalsStatsSkeleton />}>
        <GoalsStatsSectionWrapper
          stats={{
            totalTarget,
            totalSaved,
            remaining,
            totalProgress,
            activeGoalsCount: activeGoals.length,
            completedGoalsCount: completedGoals.length,
            avgProgress,
            daysUntilNearest,
          }}
        />
      </Suspense>

      <Suspense fallback={<GoalsFiltersSkeleton />}>
        <GoalsFiltersWrapper
          activeGoals={activeGoals}
          completedGoals={completedGoals}
          allGoals={allGoals}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}
