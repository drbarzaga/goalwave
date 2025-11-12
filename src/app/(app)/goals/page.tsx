import React from "react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import GoalCard from "@/components/shared/goal-card";

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
  const activeGoals = allGoals.filter((g) => g.status === "active");
  const completedGoals = allGoals.filter((g) => g.status === "completed");

  return (
    <div className="container mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mis Metas</h1>
        <p className="text-muted-foreground mt-2">
          Administra y da seguimiento a tus objetivos financieros
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar metas..." className="pl-9" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Activas ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({completedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="all">Todas ({allGoals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} {...goal} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} {...goal} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allGoals.map((goal) => (
              <GoalCard key={goal.id} {...goal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
