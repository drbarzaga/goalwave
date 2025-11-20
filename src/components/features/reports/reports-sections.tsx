import { Suspense } from "react";
import { DollarSign, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/features/dashboard/stats-card";
import { getReportsSummaryAction, getMonthlyAnalysisAction } from "@/actions/goals";
import { MonthlyChart } from "./monthly-chart";
import { ReportsSkeleton } from "./reports-skeletons";
import { CategoryReportsSection } from "./category-reports-section";
import { GoalProgressSection } from "./goal-progress-section";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export async function ReportsStatsSection() {
  const result = await getReportsSummaryAction();

  if (!result.success) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se pudieron cargar las estadísticas
      </div>
    );
  }

  const { currentMonth, incomeChange, expensesChange, savingsChange, savingsRateChange } = result.data;

  const stats = [
    {
      title: "Ingresos Totales",
      value: formatCurrency(currentMonth.totalIncome),
      change: `${formatPercentage(incomeChange)} vs mes anterior`,
      icon: DollarSign,
      trend: incomeChange >= 0 ? "up" : "down" as const,
    },
    {
      title: "Gastos Totales",
      value: formatCurrency(currentMonth.totalExpenses),
      change: `${formatPercentage(expensesChange)} vs mes anterior`,
      icon: TrendingDown,
      trend: expensesChange <= 0 ? "up" : "down" as const,
    },
    {
      title: "Ahorro Total",
      value: formatCurrency(currentMonth.totalSavings),
      change: `${formatPercentage(savingsChange)} vs mes anterior`,
      icon: BarChart3,
      trend: savingsChange >= 0 ? "up" : "down" as const,
    },
    {
      title: "Tasa de Ahorro",
      value: `${currentMonth.savingsRate.toFixed(1)}%`,
      change: `${formatPercentage(savingsRateChange)} vs mes anterior`,
      icon: TrendingUp,
      trend: savingsRateChange >= 0 ? "up" : "down" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}

export async function MonthlyAnalysisSection() {
  const result = await getMonthlyAnalysisAction();

  if (!result.success || !result.data.data || result.data.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis Mensual</CardTitle>
          <CardDescription>
            Comparación de ingresos, gastos y ahorros de los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay datos disponibles para mostrar
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis Mensual</CardTitle>
        <CardDescription>
          Comparación de ingresos, gastos y ahorros de los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyChart data={result.data.data} />
      </CardContent>
    </Card>
  );
}

export function ReportsPageContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground mt-2">
          Analiza tu progreso financiero y toma decisiones informadas
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsStatsSection />
      </Suspense>

      {/* Tabs for different report views */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Resumen General</TabsTrigger>
          <TabsTrigger value="categories">Por Categorías</TabsTrigger>
          <TabsTrigger value="goals">Progreso de Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
            <MonthlyAnalysisSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
            <CategoryReportsSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
            <GoalProgressSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

