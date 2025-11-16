"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  ArrowUpDown,
  Target,
  CheckCircle2,
  Sparkles,
  Clock,
  Eye,
  EyeOff,
  Wallet,
  TrendingDown,
  Percent,
  Flag,
  Trophy,
  Activity,
} from "lucide-react";
import GoalCard from "@/components/shared/goal-card";
import CompactStats from "@/components/shared/compact-stats";
import { differenceInDays, parse } from "date-fns";
import { es } from "date-fns/locale";

const allGoals = [
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");

  // Inicializar estado desde localStorage usando lazy initializer
  const [showStats, setShowStats] = useState(() => {
    if (globalThis.window !== undefined) {
      const savedPreference = localStorage.getItem("goals-show-stats");
      if (savedPreference === null) return true;
      return savedPreference === "true";
    }
    return true;
  });

  // Guardar preferencia en localStorage cuando cambie
  const toggleStats = () => {
    const newValue = !showStats;
    setShowStats(newValue);
    localStorage.setItem("goals-show-stats", String(newValue));
  };

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

  // Filtrar y ordenar metas
  const getFilteredGoals = (goals: typeof allGoals) => {
    let filtered = goals;

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter((g) => g.category === categoryFilter);
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "progress": {
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressB - progressA;
        }
        case "amount":
          return b.targetAmount - a.targetAmount;
        default:
          return 0;
      }
    });

    return sorted;
  };

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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Resumen</h2>
          <button
            onClick={toggleStats}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
          >
            {showStats ? (
              <>
                <EyeOff className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>Ocultar</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>Mostrar</span>
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
                  value: `$${totalTarget.toLocaleString()}`,
                  variant: "default",
                  tooltip: `Suma total de todos los montos objetivo de tus metas. Incluye tanto metas activas como completadas.`,
                },
                {
                  icon: Wallet,
                  label: "Ahorrado",
                  value: `$${totalSaved.toLocaleString()}`,
                  variant: "success",
                  tooltip: `Cantidad total que has ahorrado hasta ahora en todas tus metas. Este es el dinero que ya has acumulado.`,
                },
                {
                  icon: TrendingDown,
                  label: "Restante",
                  value: `$${remaining.toLocaleString()}`,
                  variant: "default",
                  tooltip: `Cantidad que aún necesitas ahorrar para alcanzar todos tus objetivos. Se calcula restando lo ahorrado del total objetivo.`,
                },
                {
                  icon: Percent,
                  label: "Progreso",
                  value: `${totalProgress.toFixed(1)}%`,
                  variant: "info",
                  progress: totalProgress,
                  tooltip: `Porcentaje general de progreso en todas tus metas. Muestra qué tan cerca estás de alcanzar todos tus objetivos financieros.`,
                },
                {
                  icon: Flag,
                  label: "Activas",
                  value: `${activeGoals.length}`,
                  variant: "default",
                  tooltip: `Número de metas que actualmente estás trabajando para alcanzar. Estas son las metas en progreso.`,
                },
                {
                  icon: Trophy,
                  label: "Completadas",
                  value: `${completedGoals.length}`,
                  variant: "success",
                  tooltip: `Número de metas que has completado exitosamente. ¡Felicitaciones por alcanzar estos objetivos!`,
                },
                {
                  icon: Activity,
                  label: "Promedio",
                  value: `${avgProgress.toFixed(1)}%`,
                  variant: "info",
                  progress: avgProgress,
                  tooltip: `Promedio de progreso de todas tus metas activas. Te ayuda a entender el rendimiento general de tus ahorros.`,
                },
                ...(daysUntilNearest !== null && daysUntilNearest >= 0
                  ? [
                      {
                        icon: Clock,
                        label: "Próxima Meta",
                        value: `${daysUntilNearest} días`,
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

      {/* Contenedor principal con borde */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="active" className="space-y-6">
            {/* Controles superiores */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
              <TabsList className="bg-muted/50">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-background"
                >
                  Activas ({activeGoals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-background"
                >
                  Completadas ({completedGoals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-background"
                >
                  Todas ({allGoals.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar metas..."
                    className="pl-10 h-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="h-9 w-[200px] bg-background">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Categoría" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-[180px] bg-background">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Ordenar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Fecha límite</SelectItem>
                    <SelectItem value="progress">Progreso</SelectItem>
                    <SelectItem value="amount">Monto objetivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contenido de tabs */}
            <TabsContent value="active" className="mt-6 space-y-4">
              {getFilteredGoals(activeGoals).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {getFilteredGoals(activeGoals).map((goal) => (
                    <GoalCard key={goal.id} {...goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <Target className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold mb-1">
                    No se encontraron metas activas
                  </p>
                  <p className="text-sm">
                    {searchQuery || categoryFilter !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Crea tu primera meta para comenzar"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6 space-y-4">
              {getFilteredGoals(completedGoals).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {getFilteredGoals(completedGoals).map((goal) => (
                    <GoalCard key={goal.id} {...goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <CheckCircle2 className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold mb-1">
                    No hay metas completadas
                  </p>
                  <p className="text-sm">
                    {searchQuery || categoryFilter !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Las metas completadas aparecerán aquí"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6 space-y-4">
              {getFilteredGoals(allGoals).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {getFilteredGoals(allGoals).map((goal) => (
                    <GoalCard key={goal.id} {...goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <Sparkles className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold mb-1">
                    No se encontraron metas
                  </p>
                  <p className="text-sm">
                    {searchQuery || categoryFilter !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Crea tu primera meta para comenzar"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
