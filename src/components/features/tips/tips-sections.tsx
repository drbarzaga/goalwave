"use client";

import { useState } from "react";
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

interface Tip {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: typeof Lightbulb;
  category: string;
  color: string;
  bgColor: string;
  tips: string[];
}

const financialTips: Tip[] = [
  {
    id: "1",
    title: "Establece metas claras y alcanzables",
    description:
      "Define objetivos específicos con fechas límite y montos concretos. Esto te ayudará a mantenerte enfocado y motivado.",
    detailedDescription:
      "Las metas financieras efectivas siguen el principio SMART: Específicas, Medibles, Alcanzables, Relevantes y con Tiempo definido. En lugar de decir 'quiero ahorrar más', establece 'quiero ahorrar $5,000 para un viaje a Europa en 12 meses'.",
    icon: Target,
    category: "Planificación",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    tips: [
      "Escribe tus metas y revísalas regularmente",
      "Divide metas grandes en pasos más pequeños",
      "Establece fechas límite realistas",
      "Celebra cada hito alcanzado",
    ],
  },
  {
    id: "2",
    title: "Crea un fondo de emergencia",
    description:
      "Ahorra al menos 3-6 meses de gastos básicos. Este fondo te protegerá ante imprevistos sin afectar tus metas a largo plazo.",
    detailedDescription:
      "Un fondo de emergencia es tu red de seguridad financiera. Debe cubrir gastos esenciales como vivienda, alimentación, transporte y servicios básicos. Mantén este dinero en una cuenta de fácil acceso pero separada de tus gastos diarios.",
    icon: DollarSign,
    category: "Ahorro",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    tips: [
      "Comienza con un objetivo pequeño ($1,000)",
      "Automatiza transferencias mensuales",
      "No uses este fondo para gastos no esenciales",
      "Revisa y ajusta el monto anualmente",
    ],
  },
  {
    id: "3",
    title: "Revisa tus gastos regularmente",
    description:
      "Analiza tus reportes mensuales para identificar patrones de gasto y oportunidades de ahorro.",
    detailedDescription:
      "El conocimiento es poder cuando se trata de finanzas personales. Revisar regularmente tus gastos te permite identificar áreas donde puedes reducir costos, detectar suscripciones innecesarias y ajustar tu presupuesto según tus necesidades reales.",
    icon: BarChart3,
    category: "Análisis",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    tips: [
      "Revisa tus transacciones semanalmente",
      "Categoriza tus gastos para mejor análisis",
      "Identifica gastos recurrentes innecesarios",
      "Compara mes a mes para ver tendencias",
    ],
  },
  {
    id: "4",
    title: "Automatiza tus ahorros",
    description:
      "Configura transferencias automáticas hacia tus metas. Pagarte a ti mismo primero es clave para el éxito financiero.",
    detailedDescription:
      "La automatización elimina la tentación de gastar dinero que deberías ahorrar. Al programar transferencias automáticas justo después de recibir tu ingreso, te aseguras de que el ahorro sea una prioridad, no un pensamiento posterior.",
    icon: TrendingUp,
    category: "Automatización",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    tips: [
      "Configura transferencias el día que recibes tu pago",
      "Comienza con un porcentaje pequeño (5-10%)",
      "Aumenta gradualmente el monto",
      "Usa cuentas separadas para diferentes metas",
    ],
  },
  {
    id: "5",
    title: "Prioriza tus metas",
    description:
      "No todas las metas son igual de importantes. Enfócate primero en las que tienen mayor impacto en tu bienestar financiero.",
    detailedDescription:
      "Tener múltiples metas financieras puede ser abrumador. Priorizar te ayuda a concentrar tus recursos donde más importan. Generalmente, el fondo de emergencia y la deuda de alto interés deben ser las primeras prioridades antes de metas de largo plazo.",
    icon: Target,
    category: "Estrategia",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-500/10",
    tips: [
      "Clasifica tus metas por urgencia e importancia",
      "Enfócate en 2-3 metas a la vez",
      "Revisa y ajusta prioridades trimestralmente",
      "No te sientas mal por posponer metas menos críticas",
    ],
  },
  {
    id: "6",
    title: "Celebra los pequeños logros",
    description:
      "Reconocer tu progreso, incluso en metas pequeñas, te mantendrá motivado para continuar con tus objetivos más grandes.",
    detailedDescription:
      "La motivación es crucial para mantener hábitos financieros saludables. Celebrar pequeños logros crea un ciclo positivo de refuerzo que te mantiene comprometido con tus objetivos a largo plazo. No esperes hasta alcanzar la meta completa para reconocer tu esfuerzo.",
    icon: Sparkles,
    category: "Motivación",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    tips: [
      "Establece mini-celebraciones en hitos del 25%, 50%, 75%",
      "Comparte tus logros con familiares o amigos",
      "Mantén un registro visual de tu progreso",
      "Recuerda por qué empezaste cuando te sientas desmotivado",
    ],
  },
];

export function TipsPageContent() {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consejos Financieros</h1>
          <p className="text-muted-foreground mt-2">
            Aprende estrategias y mejores prácticas para alcanzar tus objetivos financieros
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {financialTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card
                key={tip.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/40 hover:border-primary/40"
                onClick={() => setSelectedTip(tip)}
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
      <Sheet open={!!selectedTip} onOpenChange={(open) => !open && setSelectedTip(null)}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto p-0">
          {selectedTip && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`rounded-xl p-3 ${selectedTip.bgColor} ${selectedTip.color} shrink-0`}
                  >
                    <selectedTip.icon className="h-6 w-6" />
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
                    {selectedTip.tips.map((tipItem, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <div className={`rounded-full p-1 ${selectedTip.bgColor} ${selectedTip.color} shrink-0 mt-0.5`}>
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
