import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
}: StatsCardProps) {
  const trendConfig = {
    up: {
      icon: ArrowUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    down: {
      icon: ArrowDown,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    neutral: {
      icon: null,
      color: "text-muted-foreground",
      bg: "bg-muted/50",
      border: "border-muted",
    },
  };

  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between gap-4">
          {/* Icon Section */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl group-hover:bg-primary/20 transition-colors duration-300" />
            <div className="relative rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2.5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300 border border-primary/10">
              <Icon className="h-5 w-5 text-primary relative z-10" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground truncate">
              {value}
            </p>
            {change && (
              <div className="flex items-center gap-1.5 pt-0.5">
                {trend !== "neutral" && TrendIcon && (
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                      config.bg,
                      config.color,
                      config.border
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    <span className="whitespace-nowrap">{change}</span>
                  </div>
                )}
                {trend === "neutral" && (
                  <p className="text-xs text-muted-foreground/70 truncate">
                    {change}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
