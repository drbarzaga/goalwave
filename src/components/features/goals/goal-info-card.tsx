"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, Bell, BellOff } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GoalInfoCardProps {
  readonly deadline?: string;
  readonly createdAt: string;
  readonly totalTransactions: number;
  readonly reminderEnabled: boolean;
}

export function GoalInfoCard({
  deadline,
  createdAt,
  totalTransactions,
  reminderEnabled,
}: GoalInfoCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadline && (
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Fecha Límite</p>
              <p className="text-sm font-semibold">{formatDate(deadline)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Creada</p>
            <p className="text-sm font-semibold">{formatDate(createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Total de Aportes</p>
            <p className="text-sm font-semibold">
              {totalTransactions}{" "}
              {totalTransactions === 1 ? "transacción" : "transacciones"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              reminderEnabled ? "bg-blue-500/10" : "bg-gray-500/10"
            }`}
          >
            {reminderEnabled ? (
              <Bell className="w-5 h-5 text-blue-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Recordatorios</p>
            <p
              className={`text-sm font-semibold ${
                reminderEnabled
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground"
              }`}
            >
              {reminderEnabled ? "Activos" : "Inactivos"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
