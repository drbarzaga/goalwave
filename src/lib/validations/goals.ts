import { z } from "zod";
import {
  GOAL_CATEGORIES_VALUES,
  GOAL_PRIORITIES_VALUES,
  GOAL_SAVING_FREQUENCIES_VALUES,
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
