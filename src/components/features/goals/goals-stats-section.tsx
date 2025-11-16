"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Target,
  Wallet,
  TrendingDown,
  Percent,
  Flag,
  Trophy,
  Activity,
  Clock,
} from "lucide-react";
import CompactStats from "@/components/shared/compact-stats";

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

interface GoalsStatsSectionProps {
  readonly stats: StatsData;
}

export default function GoalsStatsSection({ stats }: GoalsStatsSectionProps) {
  const [showStats, setShowStats] = useState(() => {
    if (globalThis.window !== undefined) {
      const savedPreference = localStorage.getItem("goals-show-stats");
      if (savedPreference === null) return true;
      return savedPreference === "true";
    }
    return true;
  });

  const toggleStats = () => {
    const newValue = !showStats;
    setShowStats(newValue);
    localStorage.setItem("goals-show-stats", String(newValue));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Estadísticas de tus metas
        </h2>
        <button
          onClick={toggleStats}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
        >
          {showStats ? (
            <>
              <EyeOff className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Ocultar Estadísticas</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Mostrar Estadísticas</span>
            </>
          )}
        </button>
      </div>

      {showStats && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <CompactStats
            stats={[
              {
                icon: Target,
                label: "Total Objetivo",
                value: `$${stats.totalTarget.toLocaleString()}`,
                variant: "default",
                tooltip: `Suma total de todos los montos objetivo de tus metas. Incluye tanto metas activas como completadas.`,
              },
              {
                icon: Wallet,
                label: "Ahorrado",
                value: `$${stats.totalSaved.toLocaleString()}`,
                variant: "success",
                tooltip: `Cantidad total que has ahorrado hasta ahora en todas tus metas. Este es el dinero que ya has acumulado.`,
              },
              {
                icon: TrendingDown,
                label: "Restante",
                value: `$${stats.remaining.toLocaleString()}`,
                variant: "default",
                tooltip: `Cantidad que aún necesitas ahorrar para alcanzar todos tus objetivos. Se calcula restando lo ahorrado del total objetivo.`,
              },
              {
                icon: Percent,
                label: "Progreso",
                value: `${stats.totalProgress.toFixed(1)}%`,
                variant: "info",
                progress: stats.totalProgress,
                tooltip: `Porcentaje general de progreso en todas tus metas. Muestra qué tan cerca estás de alcanzar todos tus objetivos financieros.`,
              },
              {
                icon: Flag,
                label: "Activas",
                value: `${stats.activeGoalsCount}`,
                variant: "default",
                tooltip: `Número de metas que actualmente estás trabajando para alcanzar. Estas son las metas en progreso.`,
              },
              {
                icon: Trophy,
                label: "Completadas",
                value: `${stats.completedGoalsCount}`,
                variant: "success",
                tooltip: `Número de metas que has completado exitosamente. ¡Felicitaciones por alcanzar estos objetivos!`,
              },
              {
                icon: Activity,
                label: "Promedio",
                value: `${stats.avgProgress.toFixed(1)}%`,
                variant: "info",
                progress: stats.avgProgress,
                tooltip: `Promedio de progreso de todas tus metas activas. Te ayuda a entender el rendimiento general de tus ahorros.`,
              },
              ...(stats.daysUntilNearest !== null && stats.daysUntilNearest >= 0
                ? [
                    {
                      icon: Clock,
                      label: "Próxima Meta",
                      value: `${stats.daysUntilNearest} días`,
                      variant: "default" as const,
                      tooltip: `Días restantes hasta la fecha límite de tu meta más cercana. Úsalo para priorizar tus ahorros.`,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </div>
  );
}
