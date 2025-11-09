import { z } from "zod";
import { ActionResult } from "@/types/core";

/**
 * Validates data with a Zod schema and returns an ActionResult with errors if it fails
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; fieldErrors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    const fieldErrors = Object.fromEntries(
      Object.entries(flattened).filter(([, value]) => value !== undefined)
    ) as Record<string, string[]>;

    return {
      success: false,
      fieldErrors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Creates an ActionResult error with a message
 */
export function createErrorResult<T = unknown>(
  message: string,
  data?: unknown
): ActionResult<T> {
  const result: ActionResult<T> = {
    success: false,
    message,
  };

  if (data !== undefined && data !== null) {
    result.data = data as T;
  }

  return result;
}

/**
 * Creates a success ActionResult with an optional message
 */
export function createSuccessResult<T>(
  message?: string,
  data?: T
): ActionResult<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Handles errors consistently
 */
export function handleActionError<T = unknown>(
  error: unknown,
  data?: T
): ActionResult<T> {
  console.error(error);
  return {
    success: false,
    data,
    message:
      (error as Error).message ||
      "Oops! Something went wrong. Please try again later.",
  };
}
