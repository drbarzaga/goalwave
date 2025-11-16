"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Transaction {
  readonly id: string;
  readonly type: "deposit" | "withdrawal";
  readonly amount: number;
  readonly date: string;
  readonly description?: string;
}

interface TransactionsHistoryCardProps {
  readonly transactions: Transaction[];
}

export function TransactionsHistoryCard({
  transactions,
}: TransactionsHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Transacciones</CardTitle>
        <CardDescription>Tus aportes recientes a esta meta</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No hay transacciones aún</p>
            <p className="text-xs mt-1">
              Agrega tu primera transacción para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const isDeposit = transaction.type === "deposit";
              const date = new Date(transaction.date);
              const formattedDate = format(date, "dd MMM yyyy", {
                locale: es,
              });

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isDeposit ? "bg-blue-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {isDeposit ? (
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {isDeposit ? "Depósito" : "Retiro"}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                      <p
                        className={`text-sm font-semibold shrink-0 ${
                          isDeposit ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isDeposit ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
