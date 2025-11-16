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
import { Search, Filter, ArrowUpDown, Target, CheckCircle2, Sparkles } from "lucide-react";
import GoalCard from "@/components/shared/goal-card";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: "active" | "completed";
}

interface GoalsFiltersProps {
  activeGoals: Goal[];
  completedGoals: Goal[];
  allGoals: Goal[];
  categories: string[];
}

export default function GoalsFilters({
  activeGoals,
  completedGoals,
  allGoals,
  categories,
}: GoalsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");

  // Filtrar y ordenar metas
  const getFilteredGoals = (goals: Goal[]) => {
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

  return (
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
  );
}

