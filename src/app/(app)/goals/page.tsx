import React, { Suspense } from "react";
import { differenceInDays, parse } from "date-fns";
import { es } from "date-fns/locale";
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

export default async function GoalsPage() {
  const result = await actions.goals.get();

  let allGoals: Goal[] = [];

  if (
    result.success &&
    result.data &&
    typeof result.data === "object" &&
    "goals" in result.data
  ) {
    allGoals = Array.isArray(result.data.goals) ? result.data.goals : [];
  }

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
    0
  );
  const totalSaved = allGoals.reduce(
    (sum: number, g: Goal) => sum + g.currentAmount,
    0
  );
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const remaining = totalTarget - totalSaved;

  // Get the average progress of the active goals
  const avgProgress =
    activeGoals.length > 0
      ? activeGoals.reduce((sum: number, g: Goal) => {
          const progress = (g.currentAmount / g.targetAmount) * 100;
          return sum + progress;
        }, 0) / activeGoals.length
      : 0;

  // Get the nearest goal (days until deadline)
  const getDaysUntilDeadline = (deadlineStr: string): number => {
    try {
      // Expected format: "31 Dic 2025" (spanish)
      const date = parse(deadlineStr, "d MMM yyyy", new Date(), { locale: es });
      const days = differenceInDays(date, new Date());
      return days >= 0 ? days : Infinity;
    } catch {
      return Infinity;
    }
  };

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
