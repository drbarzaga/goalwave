"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  CalendarIcon,
  Repeat,
  Bell,
  AlertCircle,
  Flag,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";
import { GOAL_CATEGORIES } from "@/lib/constants";
import { useNewGoalForm } from "@/components/providers/new-goal-form-provider";

export default function NewGoalPreview() {
  const { formData } = useNewGoalForm();

  const selectedCategory = GOAL_CATEGORIES.find(
    (cat) => cat.value === formData.category
  );
  const target = Number.parseFloat(formData.targetAmount) || 0;
  const current = Number.parseFloat(formData.currentAmount) || 0;
  const remaining = Math.max(0, target - current);
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const frequencyMap: Record<string, string> = {
    daily: "Diario",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    custom: "Personalizado",
  };

  // Calcular monto necesario según la frecuencia de ahorro
  let amountNeeded: number | null = null;
  let frequencyLabel = "";
  
  if (formData.date && target > 0 && remaining > 0 && formData.savingFrequency) {
    const daysRemaining = differenceInDays(formData.date, new Date());
    const monthsRemaining = differenceInMonths(formData.date, new Date());
    
    if (daysRemaining > 0) {
      const months = Math.max(monthsRemaining, 1);
      const weeks = Math.ceil(daysRemaining / 7);
      const biweeks = Math.ceil(daysRemaining / 14);
      const days = daysRemaining;

      switch (formData.savingFrequency) {
        case "daily":
          amountNeeded = remaining / days;
          frequencyLabel = "por día";
          break;
        case "weekly":
          amountNeeded = remaining / weeks;
          frequencyLabel = "por semana";
          break;
        case "biweekly":
          amountNeeded = remaining / biweeks;
          frequencyLabel = "cada quincena";
          break;
        case "monthly":
          amountNeeded = remaining / months;
          frequencyLabel = "por mes";
          break;
        case "custom":
          // Para frecuencia personalizada, mostramos el cálculo mensual como referencia
          amountNeeded = remaining / months;
          frequencyLabel = "por mes (referencia)";
          break;
        default:
          amountNeeded = remaining / months;
          frequencyLabel = "por mes";
      }
    }
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Vista Previa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[450px]">
        {/* Meta */}
        <div className="pb-4 border-b">
          <p className="text-xs font-medium text-muted-foreground mb-2">Meta</p>
          <p className="text-sm font-medium text-foreground min-h-[20px]">
            {formData.title || (
              <span className="text-muted-foreground">
                Tu próximo gran logro
              </span>
            )}
          </p>
          {formData.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {formData.description}
            </p>
          )}
        </div>

        {/* Categoría y Prioridad */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Categoría
            </p>
            {selectedCategory ? (
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg",
                  selectedCategory.bgColor
                )}
              >
                <selectedCategory.icon
                  className={cn("h-3.5 w-3.5", selectedCategory.color)}
                />
                <span className="text-xs font-medium">
                  {selectedCategory.label}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-dashed">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  —
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Prioridad
            </p>
            {formData.priority ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50">
                {formData.priority === "high" && (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-medium">Alta</span>
                  </>
                )}
                {formData.priority === "medium" && (
                  <>
                    <Flag className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-xs font-medium">Media</span>
                  </>
                )}
                {formData.priority === "low" && (
                  <>
                    <Target className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-medium">Baja</span>
                  </>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-dashed">
                <span className="text-xs font-medium text-muted-foreground">
                  —
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progreso */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-muted-foreground">
              Progreso
            </p>
            <span className="text-sm font-medium text-foreground">
              {target > 0 ? `${progress.toFixed(1)}%` : "0%"}
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500 rounded-full"
              style={{ width: `${target > 0 ? progress : 0}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Objetivo</p>
              <p className="text-sm font-medium text-foreground">
                {target > 0 ? `$${target.toLocaleString()}` : "$0"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Restante</p>
              <p className="text-sm font-medium text-foreground">
                {target > 0 ? `$${remaining.toLocaleString()}` : "$0"}
              </p>
            </div>
          </div>
          {current > 0 && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">Ahorrado</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ${current.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Fecha y Frecuencia */}
        {formData.date && (
          <div className="pb-4 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Fecha Límite
            </p>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {format(formData.date, "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
            {formData.savingFrequency &&
              formData.savingFrequency !== "monthly" && (
                <div className="mt-2 flex items-center gap-2">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground capitalize">
                    Frecuencia:{" "}
                    {frequencyMap[formData.savingFrequency] || "Personalizado"}
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Ahorro según frecuencia */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Ahorro {frequencyLabel || "necesario"}
          </p>
          {formData.date && target > 0 && remaining > 0 && amountNeeded && formData.savingFrequency ? (
            <div className="space-y-1">
              <p className="text-xl font-semibold text-primary">
                $
                {amountNeeded.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {formData.savingFrequency === "custom" ? (
                  <>Calculado como referencia mensual para alcanzar tu meta el{" "}
                  {format(formData.date, "d 'de' MMMM, yyyy", { locale: es })}</>
                ) : (
                  <>Ahorra {frequencyLabel} para alcanzar tu meta el{" "}
                  {format(formData.date, "d 'de' MMMM, yyyy", { locale: es })}</>
                )}
              </p>
              {formData.savingFrequency && formData.savingFrequency !== "monthly" && (
                <div className="mt-2 flex items-center gap-2">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Frecuencia: {frequencyMap[formData.savingFrequency] || "Personalizado"}
                  </p>
                </div>
              )}
              {formData.reminderEnabled && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Recibirás notificaciones para mantenerte al día con tu meta
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xl font-semibold text-muted-foreground">$0</p>
              <p className="text-xs text-muted-foreground">
                {(() => {
                  if (!formData.date) return "Selecciona una fecha límite";
                  if (target === 0) return "Ingresa un monto objetivo";
                  if (!formData.savingFrequency) return "Selecciona una frecuencia de ahorro";
                  return "Completa los datos necesarios";
                })()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
