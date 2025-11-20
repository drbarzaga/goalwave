import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getGoalProgressReportsAction } from "@/actions/goals";
import { Target, ArrowRight } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "paused":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Activa";
    case "completed":
      return "Completada";
    case "paused":
      return "Pausada";
    default:
      return status;
  }
}

export async function GoalProgressSection() {
  const result = await getGoalProgressReportsAction();

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Metas</CardTitle>
          <CardDescription>
            Visualiza el progreso de todas tus metas financieras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No se pudo cargar el progreso de metas
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressData = result.data.data;

  if (progressData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Metas</CardTitle>
          <CardDescription>
            Visualiza el progreso de todas tus metas financieras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tienes metas creadas aún
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group by status
  const activeGoals = progressData.filter((g) => g.status === "active");
  const completedGoals = progressData.filter((g) => g.status === "completed");
  const otherGoals = progressData.filter(
    (g) => g.status !== "active" && g.status !== "completed"
  );

  const allGoals = [...activeGoals, ...completedGoals, ...otherGoals];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso de Metas</CardTitle>
        <CardDescription>
          Visualiza el progreso de todas tus metas financieras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {allGoals.map((goal) => (
            <Link
              key={goal.goalId}
              href={`/goals/${goal.goalId}`}
              className="block"
            >
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {goal.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(goal.status)}>
                    {getStatusLabel(goal.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{goal.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} de{" "}
                      {formatCurrency(goal.targetAmount)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

