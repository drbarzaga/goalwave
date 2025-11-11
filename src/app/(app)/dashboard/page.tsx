import { Suspense } from "react";
import Link from "next/link";
import { Plus, DollarSign, BarChart3, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/metadata";
import {
  StatsSkeleton,
  GoalsSkeleton,
  DeadlinesSkeleton,
  MonthlySummarySkeleton,
  ActivitiesSkeleton,
  AchievementsSkeleton,
  RecentActivitySkeleton,
  TipSkeleton,
} from "@/components/features/dashboard/skeletons";
import {
  StatsSection,
  RecentGoalsSection,
  UpcomingDeadlinesSection,
  MonthlySummarySection,
  TodayActivitiesSection,
  RecentAchievementsSection,
  RecentActivitySection,
  DailyTipSection,
} from "@/components/features/dashboard/dashboard-sections";

const quickActions = [
  { label: "Nueva Meta", icon: Plus, href: "/goals/new", color: "bg-primary" },
  {
    label: "Agregar Ahorro",
    icon: DollarSign,
    href: "/savings",
    color: "bg-green-500",
  },
  {
    label: "Ver Reportes",
    icon: BarChart3,
    href: "/reports",
    color: "bg-blue-500",
  },
  { label: "Consejos", icon: Lightbulb, href: "/tips", color: "bg-amber-500" },
];

export const metadata = pageMetadata.dashboard();

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header con Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Resumen de tus metas financieras
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Metas Recientes - 2/3 width */}
        <Suspense fallback={<GoalsSkeleton />}>
          <RecentGoalsSection />
        </Suspense>

        {/* Próximos Vencimientos */}
        <Suspense fallback={<DeadlinesSkeleton />}>
          <UpcomingDeadlinesSection />
        </Suspense>
      </div>

      {/* Second Row: Resumen, Actividades y Logros */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<MonthlySummarySkeleton />}>
          <MonthlySummarySection />
        </Suspense>

        <Suspense fallback={<ActivitiesSkeleton />}>
          <TodayActivitiesSection />
        </Suspense>

        <Suspense fallback={<AchievementsSkeleton />}>
          <RecentAchievementsSection />
        </Suspense>
      </div>

      {/* Bottom Row: Actividad Reciente y Consejo */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivitySection />
        </Suspense>

        <Suspense fallback={<TipSkeleton />}>
          <DailyTipSection />
        </Suspense>
      </div>
    </div>
  );
}
