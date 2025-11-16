import { z } from "zod";
import {
  GOAL_CATEGORIES_VALUES,
  GOAL_PRIORITIES_VALUES,
  GOAL_SAVING_FREQUENCIES_VALUES,
} from "../constants";

export const createGoalSchema = z.object({
  title: z
    .string()
    .min(1, "El titulo es requerido")
    .max(100, "El titulo no puede tener mas de 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripcion no puede tener mas de 500 caracteres"),
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
  priority: z.enum(GOAL_PRIORITIES_VALUES).optional(),
  savingFrequency: z.enum(GOAL_SAVING_FREQUENCIES_VALUES),
  reminderEnabled: z.boolean(),
});
