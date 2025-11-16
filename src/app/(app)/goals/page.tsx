import React from "react";
import { differenceInDays, parse } from "date-fns";
import { es } from "date-fns/locale";
import GoalsStatsSection from "@/components/features/goals/goals-stats-section";
import GoalsFilters from "@/components/features/goals/goals-filters";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: "active" | "completed";
};

const allGoals: Goal[] = [
  {
    id: "1",
    title: "Fondo de Emergencia",
    targetAmount: 10000,
    currentAmount: 7500,
    deadline: "31 Dic 2025",
    category: "Seguridad Financiera",
    status: "active",
  },
  {
    id: "2",
    title: "Vacaciones Europa",
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: "15 Jun 2025",
    category: "Viajes",
    status: "active",
  },
  {
    id: "3",
    title: "Nuevo Laptop",
    targetAmount: 2000,
    currentAmount: 1750,
    deadline: "28 Feb 2025",
    category: "Tecnología",
    status: "active",
  },
  {
    id: "4",
    title: "Inversión Inicial",
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: "31 Dic 2025",
    category: "Inversiones",
    status: "active",
  },
  {
    id: "5",
    title: "Nuevo Teléfono",
    targetAmount: 1200,
    currentAmount: 1200,
    deadline: "15 Ene 2025",
    category: "Tecnología",
    status: "completed",
  },
];

export default function GoalsPage() {
  const activeGoals = allGoals.filter((g) => g.status === "active");
  const completedGoals = allGoals.filter((g) => g.status === "completed");

  // Calcular estadísticas
  const totalTarget = allGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = allGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const remaining = totalTarget - totalSaved;

  // Promedio de progreso de metas activas
  const avgProgress =
    activeGoals.length > 0
      ? activeGoals.reduce((sum, g) => {
          const progress = (g.currentAmount / g.targetAmount) * 100;
          return sum + progress;
        }, 0) / activeGoals.length
      : 0;

  // Meta más cercana (días hasta deadline)
  const getDaysUntilDeadline = (deadlineStr: string): number => {
    try {
      // Formato esperado: "31 Dic 2025" (español)
      const date = parse(deadlineStr, "d MMM yyyy", new Date(), { locale: es });
      const days = differenceInDays(date, new Date());
      return days >= 0 ? days : Infinity;
    } catch {
      return Infinity;
    }
  };

  const nearestGoal =
    activeGoals.length > 0
      ? activeGoals.reduce((nearest, current) => {
          const currentDays = getDaysUntilDeadline(current.deadline);
          const nearestDays = getDaysUntilDeadline(nearest.deadline);
          return currentDays < nearestDays ? current : nearest;
        })
      : null;

  const daysUntilNearest = nearestGoal
    ? getDaysUntilDeadline(nearestGoal.deadline)
    : null;

  const categories = Array.from(new Set(allGoals.map((g) => g.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Mis Metas
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Administra y da seguimiento a tus objetivos financieros
        </p>
      </div>

      {/* Estadísticas con toggle */}
      <GoalsStatsSection
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

      {/* Contenedor principal con borde */}
      <GoalsFilters
        activeGoals={activeGoals}
        completedGoals={completedGoals}
        allGoals={allGoals}
        categories={categories}
      />
    </div>
  );
}
