"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Heart,
  Plane,
  Laptop,
  GraduationCap,
  TrendingUp,
  Home,
  DollarSign,
  Lightbulb,
  Target,
  Clock,
  Sparkles,
  AlertCircle,
  Flag,
  Bell,
  Repeat,
  Car,
  Stethoscope,
  Briefcase,
  ShoppingBag,
  Gamepad2,
  Dumbbell,
  HeartHandshake,
  Baby,
  Building2,
  Music,
  Camera,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Configuración de categorías con iconos
const categories = [
  {
    value: "emergency",
    label: "Seguridad Financiera",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "travel",
    label: "Viajes",
    icon: Plane,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    value: "vehicle",
    label: "Vehículo",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    value: "tech",
    label: "Tecnología",
    icon: Laptop,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    value: "education",
    label: "Educación",
    icon: GraduationCap,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    value: "health",
    label: "Salud",
    icon: Stethoscope,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    value: "investment",
    label: "Inversiones",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "business",
    label: "Negocio",
    icon: Briefcase,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    value: "home",
    label: "Hogar",
    icon: Home,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    value: "shopping",
    label: "Compras",
    icon: ShoppingBag,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    value: "entertainment",
    label: "Entretenimiento",
    icon: Gamepad2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    value: "fitness",
    label: "Deportes y Fitness",
    icon: Dumbbell,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "wedding",
    label: "Boda",
    icon: HeartHandshake,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    value: "baby",
    label: "Bebé/Familia",
    icon: Baby,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    value: "real-estate",
    label: "Propiedad",
    icon: Building2,
    color: "text-slate-600",
    bgColor: "bg-slate-600/10",
  },
  {
    value: "music",
    label: "Música",
    icon: Music,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    value: "photography",
    label: "Fotografía",
    icon: Camera,
    color: "text-gray-600",
    bgColor: "bg-gray-600/10",
  },
  {
    value: "food",
    label: "Restaurantes",
    icon: UtensilsCrossed,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    value: "other",
    label: "Otro",
    icon: DollarSign,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];

export default function NewGoalPage() {
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<string>("0");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [savingFrequency, setSavingFrequency] = useState<string>("monthly");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/goals");
  };

  // Calcular información del preview
  const selectedCategory = categories.find((cat) => cat.value === category);
  const target = parseFloat(targetAmount) || 0;
  const current = parseFloat(currentAmount) || 0;
  const remaining = Math.max(0, target - current);
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  // Calcular tiempo estimado
  let monthlyNeeded: number | null = null;
  if (date && target > 0 && remaining > 0) {
    const daysRemaining = differenceInDays(date, new Date());
    const monthsRemaining = differenceInMonths(date, new Date());
    if (daysRemaining > 0) {
      monthlyNeeded = remaining / Math.max(monthsRemaining, 1);
    }
  }

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Crear Nueva Meta
        </h1>
        <p className="text-muted-foreground mt-2">
          Define tu próximo objetivo financiero
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-stretch">
        {/* Columna principal - Formulario */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Información de la Meta</CardTitle>
            <CardDescription>
              Completa los detalles de tu nueva meta financiera
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
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
          </CardContent>
        </Card>

        {/* Columna secundaria - Preview y Consejos */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Preview Card */}
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
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Meta
                </p>
                <p className="text-sm font-medium text-foreground min-h-[20px]">
                  {title || (
                    <span className="text-muted-foreground">
                      Tu próximo gran logro
                    </span>
                  )}
                </p>
                {description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {description}
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
                  {priority ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50">
                      {priority === "high" && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                          <span className="text-xs font-medium">Alta</span>
                        </>
                      )}
                      {priority === "medium" && (
                        <>
                          <Flag className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="text-xs font-medium">Media</span>
                        </>
                      )}
                      {priority === "low" && (
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
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 rounded-full"
                    style={{ width: `${target > 0 ? progress : 0}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Objetivo
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {target > 0 ? `$${target.toLocaleString()}` : "$0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Restante
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {target > 0 ? `$${remaining.toLocaleString()}` : "$0"}
                    </p>
                  </div>
                </div>
                {current > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Ahorrado
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      ${current.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Fecha y Frecuencia */}
              {date && (
                <div className="pb-4 border-b">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Fecha Límite
                  </p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                  {savingFrequency && savingFrequency !== "monthly" && (
                    <div className="mt-2 flex items-center gap-2">
                      <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground capitalize">
                        Frecuencia:{" "}
                        {savingFrequency === "daily"
                          ? "Diario"
                          : savingFrequency === "weekly"
                            ? "Semanal"
                            : savingFrequency === "biweekly"
                              ? "Quincenal"
                              : savingFrequency === "monthly"
                                ? "Mensual"
                                : "Personalizado"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Ahorro mensual */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Ahorro mensual necesario
                </p>
                {date && target > 0 && remaining > 0 && monthlyNeeded ? (
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-primary">
                      $
                      {monthlyNeeded.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Para alcanzar tu meta el{" "}
                      {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    {reminderEnabled && (
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                        <Bell className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs text-muted-foreground">
                          Recordatorios activados
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-muted-foreground">
                      $0
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {!date
                        ? "Selecciona una fecha límite"
                        : target === 0
                          ? "Ingresa un monto objetivo"
                          : "Completa los datos necesarios"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consejos Card */}
          <Card className="flex-shrink-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Consejos Útiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
}
