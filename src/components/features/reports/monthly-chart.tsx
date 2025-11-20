"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import type { MonthlyDataPoint } from "@/actions/goals";

interface MonthlyChartProps {
  readonly data: MonthlyDataPoint[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: {
      month: string;
    };
  }>;
}

// Format currency for tooltip
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom tooltip component (moved outside to avoid render-time creation)
function CustomTooltip({ active, payload }: Readonly<TooltipProps>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
      <p className="text-sm font-medium mb-2 text-foreground">
        {payload[0]?.payload.month}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-foreground">
              <span className="font-medium">{entry.name}:</span>{" "}
              <span className="text-muted-foreground">
                {formatCurrency(entry.value)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const { resolvedTheme } = useTheme();

  // Colors that work well with both light and dark themes
  // Use resolvedTheme to determine if component is mounted (it's undefined initially)
  const isDark = resolvedTheme === "dark";
  const colors = {
    income: isDark ? "rgba(59, 130, 246, 0.6)" : "rgba(37, 99, 235, 0.6)", // blue with opacity
    incomeStroke: isDark ? "#3b82f6" : "#2563eb",
    expenses: isDark ? "rgba(239, 68, 68, 0.6)" : "rgba(220, 38, 38, 0.6)", // red with opacity
    expensesStroke: isDark ? "#ef4444" : "#dc2626",
    savings: "rgba(16, 185, 129, 0.6)", // emerald with opacity - same for both themes
    savingsStroke: "#10b981",
  };

  // Show loading state while theme is resolving (resolvedTheme is undefined initially)
  if (resolvedTheme === undefined) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
        Cargando gráfico...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
        No hay datos disponibles
      </div>
    );
  }

  // Format data for recharts
  const chartData = data.map((item) => ({
    month: item.monthShort,
    Ingresos: item.income,
    Gastos: item.expenses,
    Ahorros: item.savings,
  }));

  return (
    <div className="w-full space-y-4">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.incomeStroke}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.incomeStroke}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.expensesStroke}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.expensesStroke}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.savingsStroke}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.savingsStroke}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#e5e7eb"}
            opacity={0.2}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(1)}k`;
              }
              return `$${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: isDark ? "#d1d5db" : "#374151",
            }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="Ingresos"
            stroke={colors.incomeStroke}
            strokeWidth={2}
            fill="url(#colorIncome)"
            name="Ingresos"
          />
          <Area
            type="monotone"
            dataKey="Gastos"
            stroke={colors.expensesStroke}
            strokeWidth={2}
            fill="url(#colorExpenses)"
            name="Gastos"
          />
          <Area
            type="monotone"
            dataKey="Ahorros"
            stroke={colors.savingsStroke}
            strokeWidth={2}
            fill="url(#colorSavings)"
            name="Ahorros"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
