import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, Clock, Sparkles } from "lucide-react";

const tips = [
  {
    icon: Target,
    title: "Establece metas realistas",
    description:
      "Asegúrate de que tu fecha límite y monto objetivo sean alcanzables según tus ingresos.",
  },
  {
    icon: Clock,
    title: "Revisa regularmente",
    description:
      "Monitorea tu progreso semanalmente y ajusta tus aportes si es necesario.",
  },
  {
    icon: Sparkles,
    title: "Automatiza tus ahorros",
    description:
      "Configura transferencias automáticas para mantener la consistencia.",
  },
];

export default function NewGoalTips() {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Consejos Útiles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={`tip-${tip.title}`} className="flex gap-3">
              <div className="mt-0.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{tip.title}</p>
                <p className="text-xs text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
