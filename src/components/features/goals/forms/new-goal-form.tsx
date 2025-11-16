"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Repeat,
  AlertCircle,
  Flag,
  Target,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Category } from "../new-goal-types";

interface NewGoalFormProps {
  categories: Category[];
  onFormChange: (data: FormData) => void;
}

export interface FormData {
  title: string;
  description: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  date: Date | undefined;
  priority: string;
  savingFrequency: string;
  reminderEnabled: boolean;
}

export default function NewGoalForm({
  categories,
  onFormChange,
}: NewGoalFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<string>("0");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [savingFrequency, setSavingFrequency] = useState<string>("monthly");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);

  // Notificar cambios al componente padre
  React.useEffect(() => {
    onFormChange({
      title,
      description,
      category,
      targetAmount,
      currentAmount,
      date,
      priority,
      savingFrequency,
      reminderEnabled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    description,
    category,
    targetAmount,
    currentAmount,
    date,
    priority,
    savingFrequency,
    reminderEnabled,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/goals");
  };

  const selectedCategory = categories.find((cat) => cat.value === category);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre de la Meta</Label>
        <Input
          id="title"
          placeholder="Ej: Mi primer auto, Viaje a Europa, Fondo de emergencia..."
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Dale un nombre que te inspire cada vez que lo veas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          placeholder="¿Por qué es importante esta meta para ti? Escribe tus motivos..."
          rows={2}
          className="resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Una descripción clara te ayudará a mantener la motivación
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select required value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="category"
              className="w-full [&_[data-slot=select-value]_svg]:hidden"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedCategory && (
                  <selectedCategory.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selectedCategory.color
                    )}
                  />
                )}
                <SelectValue placeholder="Seleccionar categoría" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", cat.color)} />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Organiza tus metas por tipo para un mejor seguimiento
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target">Monto Objetivo</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="target"
              type="number"
              placeholder="¿Cuánto necesitas ahorrar?"
              className="pl-7"
              required
              min="1"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Establece un monto realista y alcanzable
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="current">Monto Inicial (opcional)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="current"
              type="number"
              placeholder="¿Ya tienes algo ahorrado?"
              className="pl-7"
              min="0"
              step="0.01"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Si ya empezaste a ahorrar, inclúyelo aquí
          </p>
        </div>

        <div className="space-y-2">
          <Label>Fecha Límite</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(date, "PPP", { locale: es })
                  : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Define cuándo quieres alcanzar tu meta
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority" className="w-full">
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>Alta</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-yellow-500" />
                  <span>Media</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>Baja</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Clasifica la importancia de esta meta para ti
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia de Ahorro</Label>
          <Select
            value={savingFrequency}
            onValueChange={setSavingFrequency}
          >
            <SelectTrigger id="frequency" className="w-full">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Seleccionar frecuencia" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="biweekly">Quincenal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Con qué frecuencia planeas hacer aportes
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 rounded-md border p-4 bg-muted/30">
        <input
          type="checkbox"
          id="reminder"
          checked={reminderEnabled}
          onChange={(e) => setReminderEnabled(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-input accent-primary cursor-pointer"
        />
        <div className="flex-1">
          <Label
            htmlFor="reminder"
            className="flex items-center gap-2 cursor-pointer font-medium"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span>Activar recordatorios</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1.5">
            Recibe notificaciones para mantenerte al día con tus ahorros
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          Crear Meta
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

