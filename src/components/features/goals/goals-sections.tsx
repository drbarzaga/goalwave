import GoalsStatsSection from "./goals-stats-section";
import GoalsFilters from "./goals-filters";
import type { Goal } from "@/types/goals";

interface StatsData {
  totalTarget: number;
  totalSaved: number;
  remaining: number;
  totalProgress: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
  avgProgress: number;
  daysUntilNearest: number | null;
}

interface GoalsStatsSectionWrapperProps {
  readonly stats: StatsData;
}

export async function GoalsStatsSectionWrapper({
  stats,
}: GoalsStatsSectionWrapperProps) {
  return <GoalsStatsSection stats={stats} />;
}

interface GoalsFiltersWrapperProps {
  readonly activeGoals: Goal[];
  readonly completedGoals: Goal[];
  readonly allGoals: Goal[];
  readonly categories: string[];
}

export async function GoalsFiltersWrapper({
  activeGoals,
  completedGoals,
  allGoals,
  categories,
}: GoalsFiltersWrapperProps) {
  return (
    <GoalsFilters
      activeGoals={activeGoals}
      completedGoals={completedGoals}
      allGoals={allGoals}
      categories={categories}
    />
  );
}
