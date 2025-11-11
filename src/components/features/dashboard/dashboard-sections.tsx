import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle2,
  Plus,
  Edit3,
  Lightbulb,
  Calendar,
  Zap,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/features/dashboard/stats-card";
import GoalCard from "@/components/features/dashboard/goal-card";

// Simular delay de carga
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sección de Stats
export async function StatsSection() {
  await delay(500); // Simular carga de 500ms

  const stats = [
    {
      title: "Metas Activas",
      value: "4",
      change: "+2 este mes",
      icon: Target,
      trend: "up" as const,
    },
    {
      title: "Total Ahorrado",
      value: "$12,450",
      change: "+15% del mes pasado",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Progreso Promedio",
      value: "68%",
      change: "+12% esta semana",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Días hasta meta más cercana",
      value: "45",
      change: "Vacaciones 2025",
      icon: Clock,
      trend: "neutral" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

// Sección de Metas Recientes
export async function RecentGoalsSection() {
  await delay(800); // Simular carga de 800ms

  const recentGoals = [
    {
      id: "1",
      title: "Fondo de Emergencia",
      targetAmount: 10000,
      currentAmount: 7500,
      deadline: "31 Dic 2025",
      category: "Seguridad Financiera",
    },
    {
      id: "2",
      title: "Vacaciones Europa",
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: "15 Jun 2025",
      category: "Viajes",
    },
    {
      id: "3",
      title: "Nuevo Laptop",
      targetAmount: 2000,
      currentAmount: 1750,
      deadline: "28 Feb 2025",
      category: "Tecnología",
    },
  ];

  return (
    <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Metas Recientes
          </CardTitle>
          <Link href="/goals">
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todas
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {recentGoals.slice(0, 3).map((goal) => (
            <GoalCard key={goal.id} {...goal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Sección de Próximos Vencimientos
export async function UpcomingDeadlinesSection() {
  await delay(600); // Simular carga de 600ms

  const upcomingDeadlines = [
    {
      id: "1",
      title: "Nuevo Laptop",
      deadline: "28 Feb 2025",
      daysLeft: 45,
      progress: 88,
      urgent: false,
    },
    {
      id: "2",
      title: "Vacaciones Europa",
      deadline: "15 Jun 2025",
      daysLeft: 152,
      progress: 64,
      urgent: false,
    },
  ];

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Próximos Vencimientos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingDeadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{deadline.title}</h4>
              {deadline.urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgente
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {deadline.daysLeft} días restantes
                </span>
                <span className="font-medium">{deadline.progress}%</span>
              </div>
              <Progress value={deadline.progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">
                Vence: {deadline.deadline}
              </p>
            </div>
          </div>
        ))}
        <Link href="/goals">
          <Button variant="outline" size="sm" className="w-full gap-2">
            Ver todas las metas
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Sección de Resumen Mensual
export async function MonthlySummarySection() {
  await delay(700); // Simular carga de 700ms

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Resumen Mensual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ingreso Total</span>
            <span className="font-semibold">$5,200</span>
          </div>
          <Progress value={100} className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gastos</span>
            <span className="font-semibold">$3,800</span>
          </div>
          <Progress value={73} className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ahorros</span>
            <span className="font-semibold text-green-500">$1,400</span>
          </div>
          <Progress value={27} className="h-2 w-full [&>div]:bg-green-500" />
        </div>
        <div className="pt-4 border-t">
          <Link href="/reports">
            <Button variant="outline" size="sm" className="w-full gap-2">
              Ver Reporte Completo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Sección de Actividades de Hoy
export async function TodayActivitiesSection() {
  await delay(400); // Simular carga de 400ms

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Actividades de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Revisar progreso semanal</p>
            <p className="text-xs text-muted-foreground">9:00 AM</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Agregar ahorro mensual</p>
            <p className="text-xs text-muted-foreground">2:00 PM</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Actualizar meta de viaje</p>
            <p className="text-xs text-muted-foreground">5:00 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sección de Logros Recientes
export async function RecentAchievementsSection() {
  await delay(550); // Simular carga de 550ms

  const achievements = [
    {
      title: "Primera Meta Completada",
      description: "Completaste tu primera meta financiera",
      date: "Hace 2 días",
      icon: Trophy,
    },
    {
      title: "Ahorrador Consistente",
      description: "7 días consecutivos agregando ahorros",
      date: "Hace 5 días",
      icon: Trophy,
    },
  ];

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Logros Recientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <Icon className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.date}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Sección de Actividad Reciente
export async function RecentActivitySection() {
  await delay(900); // Simular carga de 900ms

  const activities = [
    {
      action: "Agregaste",
      detail: "$500",
      goal: "Fondo de Emergencia",
      time: "Hace 2 horas",
      icon: DollarSign,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      action: "Creaste una nueva meta",
      goal: "Curso de Inversiones",
      time: "Hace 1 día",
      icon: Plus,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      action: "Completaste",
      goal: "Nuevo Teléfono",
      time: "Hace 3 días",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      action: "Actualizaste",
      goal: "Vacaciones Europa",
      time: "Hace 5 días",
      icon: Edit3,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border/50"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.bgColor}`}
                >
                  <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-sm leading-tight">
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>
                    {activity.detail && (
                      <span className="font-semibold text-foreground">
                        {" "}
                        {activity.detail}
                      </span>
                    )}
                    {activity.goal && (
                      <>
                        <span className="text-muted-foreground"> a </span>
                        <span className="font-medium text-foreground">
                          {activity.goal}
                        </span>
                      </>
                    )}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Sección de Consejo del Día
export async function DailyTipSection() {
  await delay(300); // Simular carga de 300ms

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50/50 to-blue-50 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-blue-950/40 border-blue-200 dark:border-blue-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
          <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          Consejo del Día
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <p className="text-sm leading-relaxed text-foreground">
          <strong className="text-blue-700 dark:text-blue-300 font-semibold">
            Regla 50/30/20:
          </strong>{" "}
          Destina el 50% de tus ingresos a necesidades básicas, 30% a deseos y
          gustos, y 20% a ahorros e inversiones. Esta estrategia te ayudará a
          mantener un balance financiero saludable.
        </p>
        <div className="pt-2">
          <Link href="/tips">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-blue-300 dark:border-blue-700 bg-white/50 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 text-blue-700 dark:text-blue-300 font-medium transition-all"
            >
              Ver Más Consejos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
