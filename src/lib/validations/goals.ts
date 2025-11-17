import { z } from "zod";
import {
  GOAL_CATEGORIES_VALUES,
  GOAL_PRIORITIES_VALUES,
  GOAL_SAVING_FREQUENCIES_VALUES,
  GOAL_TRANSACTION_TYPES_VALUES,
} from "../constants";

// Client-side validation schema (accepts strings and transforms them)
export const createGoalFormSchema = z.object({
  title: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
  category: z.enum(GOAL_CATEGORIES_VALUES, {
    message: "Debes seleccionar una categoría",
  }),
  targetAmount: z
    .string()
    .min(1, "El monto objetivo es requerido")
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      "El monto objetivo debe ser mayor a 0"
    ),
  currentAmount: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        (!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0),
      "El monto actual no puede ser negativo"
    ),
  date: z.date().optional().nullable(),
  priority: z
    .enum(GOAL_PRIORITIES_VALUES, {
      message: "Debes seleccionar una prioridad válida (alta, media o baja)",
    })
    .optional()
    .nullable(),
  savingFrequency: z.enum(GOAL_SAVING_FREQUENCIES_VALUES, {
    message: "Debes seleccionar una frecuencia",
  }),
  reminderEnabled: z.boolean(),
});

// Server-side validation schema (uses numbers and dates)
export const createGoalSchema = z.object({
  title: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
  category: z.enum(GOAL_CATEGORIES_VALUES),
  targetAmount: z
    .string()
    .transform((val) => Number.parseFloat(val))
    .pipe(z.number().positive("El monto objetivo debe ser mayor a 0")),
  currentAmount: z
    .string()
    .transform((val) => Number.parseFloat(val))
    .pipe(z.number().min(0, "El monto actual no puede ser negativo")),
  targetDate: z.date().optional(),
  priority: z
    .enum(GOAL_PRIORITIES_VALUES, {
      message: "Debes seleccionar una prioridad válida (alta, media o baja)",
    })
    .optional(),
  savingFrequency: z.enum(GOAL_SAVING_FREQUENCIES_VALUES, {
    message: "Debes seleccionar una frecuencia",
  }),
  reminderEnabled: z.boolean(),
});

// Transaction form schema (for react-hook-form - accepts strings)
export const transactionFormSchema = z.object({
  type: z.enum(GOAL_TRANSACTION_TYPES_VALUES, {
    message: "Debes seleccionar un tipo de transacción válido",
  }),
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      "El monto debe ser mayor a 0"
    ),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Transaction validation schema (for server - transforms to number)
export const createTransactionSchema = z.object({
  type: z.enum(GOAL_TRANSACTION_TYPES_VALUES, {
    message: "Debes seleccionar un tipo de transacción válido",
  }),
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      "El monto debe ser mayor a 0"
    )
    .transform((val) => Number.parseFloat(val))
    .pipe(z.number().positive("El monto debe ser mayor a 0")),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Update goal form schema (with cross-field validation for amounts)
export const updateGoalFormSchema = createGoalFormSchema.superRefine(
  (data, ctx) => {
    const targetAmount = Number.parseFloat(data.targetAmount || "0");
    const currentAmount = Number.parseFloat(data.currentAmount || "0");

    // Validate that currentAmount doesn't exceed targetAmount
    if (!Number.isNaN(currentAmount) && !Number.isNaN(targetAmount)) {
      if (currentAmount > targetAmount) {
        ctx.addIssue({
          code: "custom",
          message: "El monto actual no puede ser mayor que el monto objetivo",
          path: ["currentAmount"],
        });
      }
    }
  }
);

// Update goal schema (with cross-field validation for server-side)
export const updateGoalSchema = createGoalSchema.superRefine((data, ctx) => {
  // Validate that currentAmount doesn't exceed targetAmount
  if (data.currentAmount > data.targetAmount) {
    ctx.addIssue({
      code: "custom",
      message: "El monto actual no puede ser mayor que el monto objetivo",
      path: ["currentAmount"],
    });
  }
});
