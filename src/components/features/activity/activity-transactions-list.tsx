"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, ArrowRight, Filter, Search, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ActivityTransaction } from "@/actions/goals";

interface ActivityTransactionsListProps {
  transactions: ActivityTransaction[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ActivityTransactionsList({
  transactions,
}: ActivityTransactionsListProps) {
  const [filterType, setFilterType] = useState<"all" | "deposit" | "withdrawal">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique categories
  const categories = Array.from(
    new Set(transactions.map((tx) => tx.goalCategory))
  ).sort();

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const typeMatch = filterType === "all" || tx.type === filterType;
    const categoryMatch = filterCategory === "all" || tx.goalCategory === filterCategory;
    const searchMatch =
      searchQuery === "" ||
      tx.goalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.goalCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && categoryMatch && searchMatch;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      const dateLabel = format(date, "EEEE, d 'de' MMMM", { locale: es });

      if (!acc[dateKey]) {
        acc[dateKey] = {
          label: dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1),
          transactions: [],
        };
      }
      acc[dateKey].transactions.push(transaction);
      return acc;
    },
    {} as Record<
      string,
      { label: string; transactions: ActivityTransaction[] }
    >
  );

  const hasActiveFilters = filterType !== "all" || filterCategory !== "all" || searchQuery !== "";

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Historial de Transacciones</CardTitle>
            <CardDescription>
              {filteredTransactions.length} {filteredTransactions.length === 1 ? "transacción" : "transacciones"}
              {hasActiveFilters && ` (${transactions.length} total)`}
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType("all");
                setFilterCategory("all");
                setSearchQuery("");
              }}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por meta, descripción o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="deposit">Ingresos</SelectItem>
              <SelectItem value="withdrawal">Gastos</SelectItem>
            </SelectContent>
          </Select>
          {categories.length > 0 && (
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {hasActiveFilters ? "No se encontraron resultados" : "No hay transacciones"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {hasActiveFilters
                ? "Intenta ajustar los filtros o la búsqueda para encontrar transacciones."
                : "Comienza creando metas y agregando transacciones para ver tu actividad aquí."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([dateKey, group]) => (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-3 sticky top-0 bg-background py-2 z-10">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-sm font-semibold text-muted-foreground px-2">
                    {group.label}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-2">
                  {group.transactions.map((transaction) => {
                    const isDeposit = transaction.type === "deposit";
                    const Icon = isDeposit ? TrendingUp : TrendingDown;

                    return (
                      <Link
                        key={transaction.id}
                        href={`/goals/${transaction.goalId}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 group bg-card">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className={`rounded-xl p-3 shrink-0 transition-transform group-hover:scale-110 ${
                                isDeposit
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-destructive/10 text-destructive border border-destructive/20"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                  {transaction.goalTitle}
                                </p>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {transaction.goalCategory}
                                </Badge>
                              </div>
                              {transaction.description && (
                                <p className="text-sm text-muted-foreground truncate mb-1">
                                  {transaction.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(transaction.createdAt),
                                    "HH:mm",
                                    { locale: es }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span
                                className={`text-lg font-bold block ${
                                  isDeposit
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-destructive"
                                }`}
                              >
                                {isDeposit ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
