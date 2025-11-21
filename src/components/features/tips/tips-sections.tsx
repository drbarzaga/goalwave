"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { actions } from "@/actions";

interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
  detailedDescription: string;
  tips: string[];
  icon?: typeof Lightbulb;
  color?: string;
  bgColor?: string;
}

// Mapeo de iconos y colores por categoría
const categoryConfig: Record<
  string,
  {
    icon: typeof Lightbulb;
    color: string;
    bgColor: string;
  }
> = {
  Planificación: {
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  Ahorro: {
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  Análisis: {
    icon: BarChart3,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  Automatización: {
    icon: TrendingUp,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  Estrategia: {
    icon: Target,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  Motivación: {
    icon: Sparkles,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
  },
};

const defaultConfig = {
  icon: Lightbulb,
  color: "text-blue-600 dark:text-blue-400",
  bgColor: "bg-blue-500/10",
};

export function TipsPageContent() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTips() {
      try {
        const result = await actions.goals.getFinancialTips();
        if (
          result.success &&
          result.data &&
          typeof result.data === "object" &&
          "tips" in result.data &&
          Array.isArray(result.data.tips)
        ) {
          const tipsWithConfig = result.data.tips.map((tip) => {
            const config = categoryConfig[tip.category] || defaultConfig;
            return {
              ...tip,
              icon: config.icon,
              color: config.color,
              bgColor: config.bgColor,
            };
          });
          setTips(tipsWithConfig);
        }
      } catch (error) {
        console.error("Error cargando consejos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTips();
  }, []);

  const handleTipClick = (tip: Tip) => {
    // Los detalles ya vienen incluidos desde la carga inicial
    setSelectedTip(tip);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Consejos Financieros
          </h1>
          <p className="text-muted-foreground mt-2">
            Aprende estrategias y mejores prácticas para alcanzar tus objetivos
            financieros
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Consejos Financieros
          </h1>
          <p className="text-muted-foreground mt-2">
            Aprende estrategias y mejores prácticas para alcanzar tus objetivos
            financieros
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon || Lightbulb;
            return (
              <Card
                key={tip.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/40 hover:border-primary/40"
                onClick={() => handleTipClick(tip)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-xl p-3 ${tip.bgColor} ${tip.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tip.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {tip.description}
                  </p>
                  <p className="text-xs text-primary mt-3 font-medium group-hover:underline">
                    Leer más →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet
        open={!!selectedTip}
        onOpenChange={(open) => !open && setSelectedTip(null)}
      >
        <SheetContent className="sm:max-w-[540px] overflow-y-auto p-0">
          {selectedTip && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`rounded-xl p-3 ${selectedTip.bgColor} ${selectedTip.color} shrink-0`}
                  >
                    {(() => {
                      const Icon = selectedTip.icon || Lightbulb;
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedTip.category}
                  </Badge>
                </div>
                <SheetTitle className="text-2xl font-bold leading-tight">
                  {selectedTip.title}
                </SheetTitle>
                <SheetDescription className="text-base mt-3 text-muted-foreground">
                  {selectedTip.description}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Descripción Detallada
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTip.detailedDescription}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Consejos Prácticos
                  </h3>
                  <ul className="space-y-3">
                    {selectedTip.tips.map((tipItem) => (
                      <li
                        key={tipItem}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <div
                          className={`rounded-full p-1 ${selectedTip.bgColor} ${selectedTip.color} shrink-0 mt-0.5`}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <span className="leading-relaxed">{tipItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
