import { differenceInDays, parse } from "date-fns";
import { es } from "date-fns/locale";
import type { Goal } from "@/types/goals";
import {
  DATE_FORMAT_PATTERN,
  NO_DEADLINE_TEXT,
  PERCENTAGE_MAX,
} from "@/lib/constants";
import { actions } from "@/actions";

/**
 * Calculates the number of days until a deadline
 * @param deadlineStr - Deadline string in format "d MMM yyyy" or "Sin fecha límite"
 * @returns Number of days until deadline, or Infinity if no deadline or invalid date
 */
export function getDaysUntilDeadline(deadlineStr: string): number {
  if (deadlineStr === NO_DEADLINE_TEXT) return Infinity;
  try {
    const date = parse(deadlineStr, DATE_FORMAT_PATTERN, new Date(), {
      locale: es,
    });
    const days = differenceInDays(date, new Date());
    return days >= 0 ? days : Infinity;
  } catch {
    return Infinity;
  }
}

/**
 * Calculates progress percentage for a goal
 * @param currentAmount - Current amount saved
 * @param targetAmount - Target amount
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount === 0) return 0;
  return Math.min(
    (currentAmount / targetAmount) * PERCENTAGE_MAX,
    PERCENTAGE_MAX
  );
}

/**
 * Extracts goals from the result of getGoalsAction
 * @param result - Result from actions.goals.get()
 * @returns Array of goals
 */
export function extractGoalsFromResult(
  result: Awaited<ReturnType<typeof actions.goals.get>>
): Goal[] {
  if (
    result.success &&
    result.data &&
    typeof result.data === "object" &&
    "goals" in result.data
  ) {
    return Array.isArray(result.data.goals) ? result.data.goals : [];
  }
  return [];
}
