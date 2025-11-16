import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompactStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "default" | "success" | "info";
  progress?: number; // Para mostrar progreso visual opcional
  tooltip?: string; // Información adicional para el tooltip
}

export function CompactStat({
  icon: Icon,
  label,
  value,
  variant = "default",
  progress,
  tooltip,
}: CompactStatProps) {
  const variantConfig = {
    default: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-foreground",
      progressColor: "bg-primary",
    },
    success: {
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-600 dark:text-green-400",
      progressColor: "bg-green-500",
    },
    info: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-600 dark:text-blue-400",
      progressColor: "bg-blue-500",
    },
  };

  const config = variantConfig[variant];

  const statContent = (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-background/50 border border-border/50",
        "hover:bg-background hover:border-border hover:shadow-sm",
        "transition-all duration-200",
        tooltip && "cursor-help"
      )}
    >
      {/* Icono elegante */}
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          "transition-all duration-200",
          config.iconBg,
          "group-hover:scale-105"
        )}
      >
        <Icon className={cn("h-4 w-4", config.iconColor)} />
      </div>

      {/* Contenido */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium text-muted-foreground mb-0.5">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-lg font-bold leading-none", config.valueColor)}>
            {value}
          </span>
          {progress !== undefined && (
            <div className="flex-1 max-w-[60px] h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  config.progressColor
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{statContent}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-xs opacity-90">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return statContent;
}

interface CompactStatsProps {
  stats: CompactStatProps[];
  className?: string;
}

export default function CompactStats({ stats, className }: CompactStatsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
        className
      )}
    >
      {stats.map((stat, index) => (
        <CompactStat key={index} {...stat} />
      ))}
    </div>
  );
}

