"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
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
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { GOAL_CATEGORIES, DATE_FORMAT_PATTERN } from "@/lib/constants";
import { ActionResult } from "@/types/core";
import { CreateGoalFormData, GoalFormData } from "@/types/goals";
import { actions } from "@/actions";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGoalFormSchema } from "@/lib/validations/goals";
import { toast } from "sonner";

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

interface EditGoalModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly goalId: string;
  readonly initialData: {
    title: string;
    description?: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    priority?: string;
    savingFrequency: string;
    reminderEnabled: boolean;
  };
  readonly onSuccess?: () => void;
}

export function EditGoalModal({
  open,
  onOpenChange,
  goalId,
  initialData,
  onSuccess,
}: EditGoalModalProps) {
  const router = useRouter();
  const hasShownMessageRef = useRef(false);

  // Parse deadline string to Date if it exists
  const initialDate = initialData.deadline
    ? parse(initialData.deadline, DATE_FORMAT_PATTERN, new Date(), {
        locale: es,
      })
    : undefined;

  const [formState, formAction, isPending] = useActionState(
    actions.goals.update as (
      prevState: ActionResult<GoalFormData> | null,
      formData: FormData
    ) => Promise<ActionResult<GoalFormData>>,
    INITIAL_STATE
  );

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: clientErrors },
    setError,
    clearErrors,
    setValue,
    control,
    reset,
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(updateGoalFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      category: initialData.category,
      targetAmount: initialData.targetAmount.toString(),
      currentAmount: initialData.currentAmount.toString(),
      date: initialDate || undefined,
      priority: initialData.priority || "",
      savingFrequency: initialData.savingFrequency || "monthly",
      reminderEnabled: initialData.reminderEnabled || false,
    },
  });

  const watchedValues = useWatch({
    control,
  });

  // Calculate numeric values for validation
  const targetAmountNum = Number.parseFloat(watchedValues.targetAmount || "0");
  const currentAmountNum = Number.parseFloat(
    watchedValues.currentAmount || "0"
  );
  const initialCurrentAmountNum = initialData.currentAmount;

  // Validate amounts in real-time
  const amountError =
    !Number.isNaN(targetAmountNum) &&
    !Number.isNaN(currentAmountNum) &&
    currentAmountNum > targetAmountNum
      ? "El monto actual no puede ser mayor que el monto objetivo"
      : undefined;

  // Warning if reducing targetAmount below current amount
  const targetAmountWarning =
    !Number.isNaN(targetAmountNum) && targetAmountNum < initialCurrentAmountNum
      ? `El monto objetivo es menor que el monto actual ahorrado ($${initialCurrentAmountNum.toLocaleString(
          "es-ES",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}). El monto actual se ajustará automáticamente.`
      : undefined;

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (open) {
      const parsedDate = initialData.deadline
        ? parse(initialData.deadline, DATE_FORMAT_PATTERN, new Date(), {
            locale: es,
          })
        : undefined;

      reset({
        title: initialData.title,
        description: initialData.description || "",
        category: initialData.category,
        targetAmount: initialData.targetAmount.toString(),
        currentAmount: initialData.currentAmount.toString(),
        date: parsedDate || undefined,
        priority: initialData.priority || "",
        savingFrequency: initialData.savingFrequency || "monthly",
        reminderEnabled: initialData.reminderEnabled || false,
      });
      hasShownMessageRef.current = false;
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  // Handle server field errors
  useEffect(() => {
    if (
      formState.fieldErrors &&
      Object.keys(formState.fieldErrors).length > 0
    ) {
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

  // Handle server messages - only show once
  useEffect(() => {
    if (formState.message && !hasShownMessageRef.current) {
      if (formState.success) {
        hasShownMessageRef.current = true;
        toast.success(formState.message);
        startTransition(() => {
          onOpenChange(false);
          onSuccess?.();
          router.refresh();
        });
      } else {
        hasShownMessageRef.current = true;
        if (open) {
          toast.error(formState.message);
        }
      }
    }
  }, [
    formState.message,
    formState.success,
    open,
    onOpenChange,
    onSuccess,
    router,
  ]);

  const selectedCategory = GOAL_CATEGORIES.find(
    (cat) => cat.value === watchedValues.category
  );

  const onSubmit = useCallback(
    (data: CreateGoalFormData) => {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("goalId", goalId);
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
        hasShownMessageRef.current = false;
        formAction(formDataToSubmit);
      });
    },
    [goalId, formAction]
  );

  const handleFormSubmitWrapper = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleFormSubmit(onSubmit)(e);
    },
    [handleFormSubmit, onSubmit]
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      hasShownMessageRef.current = false;
      clearErrors();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu meta financiera
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmitWrapper} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-title">
                Nombre de la Meta <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="edit-title"
                  placeholder="Ej: Mi primer auto, Viaje a Europa..."
                  disabled={isPending}
                  {...register("title")}
                  aria-invalid={!!clientErrors.title}
                />
                <FieldError>
                  {clientErrors.title?.message ||
                    formState.fieldErrors?.title?.[0]?.toString()}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-description">
                Descripción (opcional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="edit-description"
                  placeholder="¿Por qué es importante esta meta para ti?"
                  rows={2}
                  className="resize-none"
                  disabled={isPending}
                  {...register("description")}
                  aria-invalid={!!clientErrors.description}
                />
                <FieldError>
                  {clientErrors.description?.message ||
                    formState.fieldErrors?.description?.[0]?.toString()}
                </FieldError>
              </FieldContent>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-category">
                  Categoría <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value) => setValue("category", value)}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      id="edit-category"
                      className="w-full [&_[data-slot=select-value]_svg]:hidden"
                      aria-invalid={!!clientErrors.category}
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
                  <FieldError>
                    {clientErrors.category?.message ||
                      formState.fieldErrors?.category?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-target">
                  Monto Objetivo <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="edit-target"
                      type="number"
                      placeholder="¿Cuánto necesitas ahorrar?"
                      className="pl-7"
                      min="1"
                      step="0.01"
                      disabled={isPending}
                      {...register("targetAmount", {
                        onChange: (e) => {
                          const newTargetAmount = Number.parseFloat(
                            e.target.value || "0"
                          );
                          const currentAmountValue = Number.parseFloat(
                            watchedValues.currentAmount || "0"
                          );

                          // If targetAmount is reduced below currentAmount, adjust currentAmount
                          if (
                            !Number.isNaN(newTargetAmount) &&
                            !Number.isNaN(currentAmountValue) &&
                            newTargetAmount > 0 &&
                            currentAmountValue > newTargetAmount
                          ) {
                            setValue(
                              "currentAmount",
                              newTargetAmount.toString(),
                              {
                                shouldValidate: true,
                              }
                            );
                          }

                          // Trigger validation
                          if (watchedValues.currentAmount) {
                            setValue(
                              "currentAmount",
                              watchedValues.currentAmount,
                              {
                                shouldValidate: true,
                              }
                            );
                          }
                        },
                      })}
                      aria-invalid={
                        !!clientErrors.targetAmount || !!targetAmountWarning
                      }
                    />
                  </div>
                  {targetAmountWarning && (
                    <div className="mt-1.5 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 p-2.5">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        {targetAmountWarning}
                      </p>
                    </div>
                  )}
                  <FieldError>
                    {clientErrors.targetAmount?.message ||
                      formState.fieldErrors?.targetAmount?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-current">
                  Monto Actual (opcional)
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="edit-current"
                      type="number"
                      placeholder="Monto actual ahorrado"
                      className="pl-7"
                      min="0"
                      max={
                        Number.isFinite(targetAmountNum)
                          ? targetAmountNum
                          : undefined
                      }
                      step="0.01"
                      disabled={isPending}
                      {...register("currentAmount", {
                        onChange: (e) => {
                          const value = Number.parseFloat(
                            e.target.value || "0"
                          );
                          // Auto-adjust if exceeds targetAmount
                          if (
                            !Number.isNaN(value) &&
                            !Number.isNaN(targetAmountNum) &&
                            value > targetAmountNum &&
                            targetAmountNum > 0
                          ) {
                            setValue(
                              "currentAmount",
                              targetAmountNum.toString(),
                              {
                                shouldValidate: true,
                              }
                            );
                          }
                        },
                      })}
                      aria-invalid={
                        !!clientErrors.currentAmount || !!amountError
                      }
                    />
                  </div>
                  {amountError && (
                    <div className="mt-1.5 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-2.5">
                      <p className="text-xs text-red-800 dark:text-red-200">
                        {amountError}
                      </p>
                    </div>
                  )}
                  <FieldError>
                    {amountError ||
                      clientErrors.currentAmount?.message ||
                      formState.fieldErrors?.currentAmount?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-target-date">Fecha Límite</FieldLabel>
                <FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-target-date"
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
                  <FieldError>
                    {clientErrors.date?.message ||
                      formState.fieldErrors?.date?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-priority">Prioridad</FieldLabel>
                <FieldContent>
                  <Select
                    value={watchedValues.priority || ""}
                    onValueChange={(value) =>
                      setValue("priority", value || undefined)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger id="edit-priority" className="w-full">
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
                  <FieldError>
                    {clientErrors.priority?.message ||
                      formState.fieldErrors?.priority?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-frequency">
                  Frecuencia de Ahorro{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={watchedValues.savingFrequency}
                    onValueChange={(value) =>
                      setValue("savingFrequency", value)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger id="edit-frequency" className="w-full">
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
                  <FieldError>
                    {clientErrors.savingFrequency?.message ||
                      formState.fieldErrors?.savingFrequency?.[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>

            <Field
              orientation="horizontal"
              className="rounded-md border p-4 bg-muted/30"
            >
              <div className="flex-1">
                <FieldLabel
                  htmlFor="edit-reminder"
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
                    id="edit-reminder"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
