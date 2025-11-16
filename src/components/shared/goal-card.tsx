import {
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { GOAL_CATEGORIES } from "@/lib/constants";

interface GoalCardProps {
  readonly id: string;
  readonly title: string;
  readonly targetAmount: number;
  readonly currentAmount: number;
  readonly deadline: string;
  readonly category: string;
}

const iconStyles = {
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
  purple: "bg-purple-500/10 text-purple-500",
  orange: "bg-orange-500/10 text-orange-500",
  pink: "bg-pink-500/10 text-pink-500",
  yellow: "bg-yellow-500/10 text-yellow-500",
  red: "bg-red-500/10 text-red-500",
  indigo: "bg-indigo-500/10 text-indigo-500",
};

const statusConfig = {
  completed: {
    bg: "bg-green-500/10",
    class: "text-green-600 dark:text-green-400",
    icon: CheckCircle2,
  },
  "in-progress": {
    bg: "bg-blue-500/10",
    class: "text-blue-600 dark:text-blue-400",
    icon: Clock,
  },
  pending: {
    bg: "bg-yellow-500/10",
    class: "text-yellow-600 dark:text-yellow-400",
    icon: AlertCircle,
  },
};

function CategoryIcon({
  category,
  className,
}: {
  readonly category: string;
  readonly className?: string;
}) {
  const categoryConfig = GOAL_CATEGORIES.find((cat) => cat.label === category);

  if (categoryConfig) {
    const Icon = categoryConfig.icon;
    return <Icon className={className} />;
  }

  return <DollarSign className={className} />;
}

function getStatusLabel(status: string): string {
  if (status === "completed") {
    return "Completada";
  }
  if (status === "in-progress") {
    return "En progreso";
  }
  return "Pendiente";
}

function getIconStyle(category: string): keyof typeof iconStyles {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes("vivienda") || categoryLower.includes("casa"))
    return "blue";
  if (categoryLower.includes("viaje") || categoryLower.includes("vacacion"))
    return "purple";
  if (
    categoryLower.includes("tecnolog") ||
    categoryLower.includes("laptop") ||
    categoryLower.includes("computadora")
  )
    return "indigo";
  if (categoryLower.includes("educac") || categoryLower.includes("curso"))
    return "green";
  if (
    categoryLower.includes("salud") ||
    categoryLower.includes("emergencia") ||
    categoryLower.includes("seguridad")
  )
    return "red";
  if (categoryLower.includes("compra")) return "orange";
  return "blue";
}

function getStatus(progress: number): keyof typeof statusConfig {
  if (progress >= 100) return "completed";
  if (progress > 0) return "in-progress";
  return "pending";
}

function getProgressColor(progress: number): string {
  if (progress >= 100) {
    return "bg-green-500";
  } else if (progress >= 75) {
    return "bg-emerald-500";
  } else if (progress >= 50) {
    return "bg-blue-500";
  } else if (progress >= 25) {
    return "bg-amber-500";
  } else {
    return "bg-orange-500";
  }
}

export default function GoalCard({
  id,
  title,
  targetAmount,
  currentAmount,
  deadline,
  category,
}: GoalCardProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const status = getStatus(progress);
  const iconStyle = getIconStyle(category);
  const formattedAmount = `$${targetAmount.toLocaleString()}`;

  return (
    <div
      key={id}
      className={cn(
        "flex flex-col",
        "w-full",
        "bg-card",
        "rounded-xl",
        "border border-border",
        "hover:border-border/80",
        "transition-all duration-200",
        "shadow-sm backdrop-blur-xl",
        "h-full"
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className={cn("p-2 rounded-lg", iconStyles[iconStyle])}>
            <CategoryIcon category={category} className="w-4 h-4" />
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
              statusConfig[status].bg,
              statusConfig[status].class
            )}
          >
            {React.createElement(statusConfig[status].icon, {
              className: "w-3.5 h-3.5",
            })}
            {getStatusLabel(status)}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {category}
          </p>
        </div>

        {typeof progress === "number" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-card-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  getProgressColor(progress)
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {formattedAmount && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-card-foreground">
              {formattedAmount}
            </span>
            <span className="text-xs text-muted-foreground">target</span>
          </div>
        )}

        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>{deadline}</span>
        </div>
      </div>

      <div className="mt-auto border-t border-border">
        <Link href={`/goals/${id}`}>
          <button
            className={cn(
              "w-full flex items-center justify-center gap-2",
              "py-2.5 px-3",
              "text-xs font-medium",
              "text-muted-foreground",
              "hover:text-foreground",
              "hover:bg-muted",
              "transition-colors duration-200"
            )}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
