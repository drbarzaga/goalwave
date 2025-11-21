import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCategoryReportsAction } from "@/actions/goals";
import type { CategoryReport } from "@/actions/goals";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function CategoryReportsSection() {
  const result = await getCategoryReportsAction();

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reportes por Categorías</CardTitle>
          <CardDescription>
            Análisis detallado de tus metas por categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No se pudieron cargar los reportes por categoría
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    !result.data ||
    typeof result.data !== "object" ||
    !("data" in result.data) ||
    !Array.isArray(result.data.data) ||
    result.data.data.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reportes por Categorías</CardTitle>
          <CardDescription>
            Análisis detallado de tus metas por categoría
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

  const categoryData: CategoryReport[] = result.data.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por Categorías</CardTitle>
        <CardDescription>
          Análisis detallado de tus metas por categoría del mes actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div
              key={`${category.category}-${index}`}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{category.category}</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {category.goalCount}{" "}
                  {category.goalCount === 1 ? "meta" : "metas"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ingresos</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(category.totalIncome)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gastos</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(category.totalExpenses)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ahorros</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(category.totalSavings)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
