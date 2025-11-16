import GoalsStatsSection from "./goals-stats-section";
import GoalsFilters from "./goals-filters";

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: "active" | "completed";
};

// Delay mínimo para permitir que los skeletons se muestren durante la hidratación
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  stats: StatsData;
}

export async function GoalsStatsSectionWrapper({
  stats,
}: GoalsStatsSectionWrapperProps) {
  // Delay muy corto solo para permitir que React muestre el skeleton durante la hidratación
  await delay(50);
  return <GoalsStatsSection stats={stats} />;
}

interface GoalsFiltersWrapperProps {
  activeGoals: Goal[];
  completedGoals: Goal[];
  allGoals: Goal[];
  categories: string[];
}

export async function GoalsFiltersWrapper({
  activeGoals,
  completedGoals,
  allGoals,
  categories,
}: GoalsFiltersWrapperProps) {
  // Delay muy corto solo para permitir que React muestre el skeleton durante la hidratación
  await delay(50);
  return (
    <GoalsFilters
      activeGoals={activeGoals}
      completedGoals={completedGoals}
      allGoals={allGoals}
      categories={categories}
    />
  );
}

