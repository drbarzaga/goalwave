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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import StatsCard from "@/components/features/dashboard/stats-card";
import GoalCard from "@/components/features/dashboard/goal-card";

// Datos de ejemplo
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

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Resumen de tus metas financieras
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Metas Recientes</CardTitle>
              <Link href="/goals">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {recentGoals.slice(0, 3).map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-rows-[auto_auto]">
          <Card>
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
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gastos</span>
                  <span className="font-semibold">$3,800</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ahorros</span>
                  <span className="font-semibold text-green-500">$1,400</span>
                </div>
                <Progress value={27} className="h-2 [&>div]:bg-green-500" />
              </div>
              <div className="pt-4 border-t">
                <Link href="/reports">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Ver Reporte Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
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
                  <p className="text-sm font-medium">
                    Revisar progreso semanal
                  </p>
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
                  <p className="text-sm font-medium">
                    Actualizar meta de viaje
                  </p>
                  <p className="text-xs text-muted-foreground">5:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
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
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${activity.bgColor}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${activity.iconColor}`} />
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

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Consejo del Día
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              <strong>Regla 50/30/20:</strong> Destina el 50% de tus ingresos a
              necesidades básicas, 30% a deseos y gustos, y 20% a ahorros e
              inversiones. Esta estrategia te ayudará a mantener un balance
              financiero saludable.
            </p>
            <div className="pt-2">
              <Link href="/tips">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  Ver Más Consejos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
