import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { actions } from "@/actions";
import { ActivityTransactionsList } from "./activity-transactions-list";
import { ActivitySkeleton } from "./activity-skeletons";
import { ActivityStats } from "./activity-stats";

export async function ActivityTransactionsSection() {
  const result = await actions.goals.getAllTransactions();

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Historial de todas tus transacciones financieras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No se pudo cargar la actividad
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result.data.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Historial de todas tus transacciones financieras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay actividad registrada aún. Comienza creando metas y agregando transacciones.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ActivityTransactionsList transactions={result.data.data} />;
}

export async function ActivityStatsSection() {
  const result = await actions.goals.getAllTransactions();

  if (!result.success || result.data.data.length === 0) {
    return null;
  }

  return <ActivityStats transactions={result.data.data} />;
}

export function ActivityPageContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actividad</h1>
        <p className="text-muted-foreground mt-2">
          Historial completo de todas tus transacciones financieras
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
        <ActivityStatsSection />
      </Suspense>

      {/* Transactions List */}
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityTransactionsSection />
      </Suspense>
    </div>
  );
}
