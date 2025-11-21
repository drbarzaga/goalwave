import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { ActivityTransaction } from "@/actions/goals";
import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
} from "date-fns";

interface ActivityStatsProps {
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

export function ActivityStats({ transactions }: ActivityStatsProps) {
  // Calculate stats for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const monthlyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    return isWithinInterval(txDate, { start: monthStart, end: monthEnd });
  });

  const lastMonthTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    return isWithinInterval(txDate, {
      start: lastMonthStart,
      end: lastMonthEnd,
    });
  });

  const totalDeposits = monthlyTransactions
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = monthlyTransactions
    .filter((tx) => tx.type === "withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const lastMonthDeposits = lastMonthTransactions
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const lastMonthWithdrawals = lastMonthTransactions
    .filter((tx) => tx.type === "withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netAmount = totalDeposits - totalWithdrawals;
  const lastMonthNet = lastMonthDeposits - lastMonthWithdrawals;
  const netChange = netAmount - lastMonthNet;
  const netChangePercent =
    lastMonthNet !== 0 ? (netChange / Math.abs(lastMonthNet)) * 100 : 0;

  const transactionCount = monthlyTransactions.length;
  const lastMonthCount = lastMonthTransactions.length;
  const countChange = transactionCount - lastMonthCount;

  const stats = [
    {
      title: "Ingresos del Mes",
      value: formatCurrency(totalDeposits),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      change: totalDeposits - lastMonthDeposits,
      changePercent:
        lastMonthDeposits !== 0
          ? ((totalDeposits - lastMonthDeposits) / lastMonthDeposits) * 100
          : 0,
    },
    {
      title: "Gastos del Mes",
      value: formatCurrency(totalWithdrawals),
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      change: totalWithdrawals - lastMonthWithdrawals,
      changePercent:
        lastMonthWithdrawals !== 0
          ? ((totalWithdrawals - lastMonthWithdrawals) / lastMonthWithdrawals) *
            100
          : 0,
    },
    {
      title: "Balance Neto",
      value: formatCurrency(netAmount),
      icon: DollarSign,
      color:
        netAmount >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-destructive",
      bgColor: netAmount >= 0 ? "bg-emerald-500/10" : "bg-destructive/10",
      borderColor:
        netAmount >= 0 ? "border-emerald-500/20" : "border-destructive/20",
      change: netChange,
      changePercent: netChangePercent,
    },
    {
      title: "Transacciones",
      value: transactionCount.toString(),
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      change: countChange,
      changePercent:
        lastMonthCount !== 0 ? (countChange / lastMonthCount) * 100 : 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`rounded-xl p-3 ${stat.bgColor} ${stat.borderColor} border group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.change !== 0 && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <ChangeIcon className="h-3 w-3" />
                    <span>{Math.abs(stat.changePercent).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <p
                    className={`text-xs ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(stat.change)} vs mes anterior
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
