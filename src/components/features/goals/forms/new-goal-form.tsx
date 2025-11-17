"use client";

import React, { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  CalendarIcon,
  Repeat,
  AlertCircle,
  Flag,
  Target,
  Bell,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GOAL_CATEGORIES } from "@/lib/constants";
import { useNewGoalForm } from "@/components/providers/new-goal-form-provider";
import { ActionResult } from "@/types/core";
import { CreateGoalFormData, GoalFormData } from "@/types/goals";
import { actions } from "@/actions";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalFormSchema } from "@/lib/validations/goals";
import { toast } from "sonner";
import SubmitButton from "@/components/shared/submit-button";

const INITIAL_STATE: ActionResult<GoalFormData> = {
  data: {
    title: "",
    description: "",
    category: "",
    targetAmount: "0",
    currentAmount: "0",
    date: undefined,
    priority: "",
    savingFrequency: "monthly",
    reminderEnabled: false,
  },
  success: false,
  message: undefined,
  fieldErrors: {},
};

export default function NewGoalForm() {
  const router = useRouter();
  const { formData: contextData, updateFormData } = useNewGoalForm();

  const [formState, formAction, isPending] = useActionState(
    actions.goals.create as (
      prevState: ActionResult<GoalFormData> | null,
      formData: FormData
    ) => Promise<ActionResult<GoalFormData>>,
    INITIAL_STATE
  );

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    setError,
    clearErrors,
    setValue,
    control,
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: contextData.title,
      description: contextData.description,
      category: contextData.category,
      targetAmount: contextData.targetAmount,
      currentAmount: contextData.currentAmount,
      date: contextData.date,
      priority: contextData.priority,
      savingFrequency: contextData.savingFrequency,
      reminderEnabled: contextData.reminderEnabled,
    },
  });

  const watchedValues = useWatch({
    control,
  });

  useEffect(() => {
    updateFormData({
      title: watchedValues.title || "",
      description: watchedValues.description || "",
      category: watchedValues.category || "",
      targetAmount: watchedValues.targetAmount || "",
      currentAmount: watchedValues.currentAmount || "0",
      date: watchedValues.date || undefined,
      priority: watchedValues.priority || "",
      savingFrequency: watchedValues.savingFrequency || "monthly",
      reminderEnabled: watchedValues.reminderEnabled || false,
    });
  }, [watchedValues, updateFormData]);

  useEffect(() => {
    if (formState.fieldErrors) {
      for (const [field, messages] of Object.entries(formState.fieldErrors)) {
        if (messages?.[0]) {
          setError(field as keyof CreateGoalFormData, {
            type: "server",
            message: messages[0].toString(),
          });
        }
      }
    } else {
      clearErrors();
    }
  }, [formState.fieldErrors, setError, clearErrors]);

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        toast.success(formState.message);
        router.push("/goals");
      } else {
        toast.error(formState.message);
      }
    }
  }, [formState, router]);

  const selectedCategory = GOAL_CATEGORIES.find(
    (cat) => cat.value === watchedValues.category
  );

  function onSubmit(data: CreateGoalFormData) {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", data.title);
    formDataToSubmit.append("description", data.description || "");
    formDataToSubmit.append("category", data.category);
    formDataToSubmit.append("targetAmount", data.targetAmount);
    formDataToSubmit.append("currentAmount", data.currentAmount || "0");
    if (data.date) {
      formDataToSubmit.append("date", data.date.toISOString());
    }
    if (data.priority) {
      formDataToSubmit.append("priority", data.priority);
    }
    formDataToSubmit.append("savingFrequency", data.savingFrequency);
    formDataToSubmit.append(
      "reminderEnabled",
      data.reminderEnabled ? "on" : "off"
    );

    startTransition(() => {
      formAction(formDataToSubmit);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            Nombre de la Meta <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="title"
            placeholder="Ej: Mi primer auto, Viaje a Europa, Fondo de emergencia..."
            disabled={isPending}
            {...register("title")}
            aria-invalid={!!clientErrors.title}
          />
          <FieldDescription>
            Dale un nombre que te inspire cada vez que lo veas
          </FieldDescription>
          <FieldError>
            {clientErrors.title?.message ||
              formState.fieldErrors?.title?.[0]?.toString()}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descripción (opcional)</FieldLabel>
          <Textarea
            id="description"
            placeholder="¿Por qué es importante esta meta para ti? Escribe tus motivos..."
            rows={2}
            className="resize-none"
            disabled={isPending}
            {...register("description")}
            aria-invalid={!!clientErrors.description}
          />
          <FieldDescription>
            Una descripción clara te ayudará a mantener la motivación
          </FieldDescription>
          <FieldError>
            {clientErrors.description?.message ||
              formState.fieldErrors?.description?.[0]?.toString()}
          </FieldError>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="category">
              Categoría <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={watchedValues.category}
              onValueChange={(value) => setValue("category", value)}
              disabled={isPending}
            >
              <SelectTrigger
                id="category"
                className="w-full [&_[data-slot=select-value]_svg]:hidden"
                aria-invalid={!!clientErrors.category}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedCategory && (
                    <selectedCategory.icon
                      className={cn("h-4 w-4 shrink-0", selectedCategory.color)}
                    />
                  )}
                  <SelectValue placeholder="Seleccionar categoría" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((cat) => {
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
            <FieldDescription>
              Organiza tus metas por tipo para un mejor seguimiento
            </FieldDescription>
            <FieldError>
              {clientErrors.category?.message ||
                formState.fieldErrors?.category?.[0]?.toString()}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="target">
              Monto Objetivo <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="target"
                type="number"
                placeholder="¿Cuánto necesitas ahorrar?"
                className="pl-7"
                min="1"
                step="0.01"
                disabled={isPending}
                {...register("targetAmount")}
                aria-invalid={!!clientErrors.targetAmount}
              />
            </div>
            <FieldDescription>
              Establece un monto realista y alcanzable
            </FieldDescription>
            <FieldError>
              {clientErrors.targetAmount?.message ||
                formState.fieldErrors?.targetAmount?.[0]?.toString()}
            </FieldError>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="current">Monto Inicial (opcional)</FieldLabel>
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
                disabled={isPending}
                {...register("currentAmount")}
                aria-invalid={!!clientErrors.currentAmount}
              />
            </div>
            <FieldDescription>
              Si ya empezaste a ahorrar, inclúyelo aquí
            </FieldDescription>
            <FieldError>
              {clientErrors.currentAmount?.message ||
                formState.fieldErrors?.currentAmount?.[0]?.toString()}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="target-date">Fecha Límite</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="target-date"
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedValues.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValues.date
                    ? format(watchedValues.date, "PPP", { locale: es })
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchedValues.date || undefined}
                  onSelect={(date) => setValue("date", date || undefined)}
                />
              </PopoverContent>
            </Popover>
            <FieldDescription>
              Define cuándo quieres alcanzar tu meta
            </FieldDescription>
            <FieldError>
              {clientErrors.date?.message ||
                formState.fieldErrors?.date?.[0]?.toString()}
            </FieldError>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="priority">Prioridad</FieldLabel>
            <Select
              value={watchedValues.priority || ""}
              onValueChange={(value) =>
                setValue("priority", value || undefined)
              }
              disabled={isPending}
            >
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
            <FieldDescription>
              Clasifica la importancia de esta meta para ti
            </FieldDescription>
            <FieldError>
              {clientErrors.priority?.message ||
                formState.fieldErrors?.priority?.[0]?.toString()}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="frequency">
              Frecuencia de Ahorro <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={watchedValues.savingFrequency}
              onValueChange={(value) => setValue("savingFrequency", value)}
              disabled={isPending}
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
            <FieldDescription>
              Con qué frecuencia planeas hacer aportes
            </FieldDescription>
            <FieldError>
              {clientErrors.savingFrequency?.message ||
                formState.fieldErrors?.savingFrequency?.[0]?.toString()}
            </FieldError>
          </Field>
        </div>

        <Field
          orientation="horizontal"
          className="rounded-md border p-4 bg-muted/30"
        >
          <div className="flex-1">
            <FieldLabel
              htmlFor="reminder"
              className="flex items-center gap-2 cursor-pointer font-medium"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span>Activar recordatorios</span>
            </FieldLabel>
            <FieldDescription className="mt-1.5">
              Recibe notificaciones para mantenerte al día con tus ahorros
            </FieldDescription>
          </div>
          <Controller
            name="reminderEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="reminder"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
              />
            )}
          />
        </Field>

        <Field orientation="horizontal">
          <SubmitButton type="submit" className="flex-1" loading={isPending}>
            Crear Meta
          </SubmitButton>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
