"use server";

import { db } from "@/db";
import { goals } from "@/db/schema";
import {
  createErrorResult,
  createSuccessResult,
  handleActionError,
  validateWithSchema,
} from "@/lib/actions-helpers";
import { auth } from "@/lib/auth";
import { createGoalSchema } from "@/lib/validations/goals";
import { ActionResult } from "@/types/core";
import { GoalFormData } from "@/types/goals";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  GOAL_CATEGORIES,
  MILLISECONDS_PER_DAY,
  PERCENTAGE_MAX,
  DEFAULT_AMOUNT_STRING,
  DATE_FORMAT_PATTERN,
  NO_DEADLINE_TEXT,
  DEFAULT_AMOUNT,
} from "@/lib/constants";
import type { Goal } from "@/types/goals";

export async function createGoalAction(
  prevState: ActionResult<GoalFormData> | null,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return createErrorResult("Unauthorized", {
      message: "You must be logged in to create a goal",
    });
  }

  const dateValue = formData.get("date");
  let date: Date | undefined = undefined;

  if (dateValue && !Number.isNaN(Date.parse(dateValue as string))) {
    date = new Date(dateValue as string);
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    targetAmount: formData.get("targetAmount") as string,
    currentAmount: formData.get("currentAmount") as string,
    date,
    priority: formData.get("priority") as string,
    savingFrequency: formData.get("savingFrequency") as string,
    reminderEnabled: formData.get("reminderEnabled") === "on",
  };

  try {
    const validation = validateWithSchema(createGoalSchema, {
      ...rawData,
      targetDate: date,
    });

    if (!validation.success) {
      return createErrorResult("Invalid form data", {
        message: "Please check the form data and try again",
        data: rawData,
      });
    }

    const {
      title,
      description,
      category,
      targetAmount,
      currentAmount,
      targetDate,
      priority,
      savingFrequency,
      reminderEnabled,
    } = validation.data;

    const goal = await db
      .insert(goals)
      .values({
        userId: session.user.id,
        title,
        description: description || null,
        category,
        targetAmount: targetAmount.toString(),
        currentAmount: currentAmount.toString(),
        targetDate: targetDate || null,
        priority: priority || null,
        savingFrequency,
        reminderEnabled,
      })
      .returning();

    return createSuccessResult("Goal created successfully", {
      goal: goal[0],
    });
  } catch (error) {
    return handleActionError<GoalFormData>(error, rawData);
  }
}

export async function updateGoalAction() {
  // TODO: Implement the update goal action
}

export async function deleteGoalAction() {
  // TODO: Implement the delete goal action
}

export async function getGoalsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión para ver tus metas",
      });
    }

    const goalsData = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, session.user.id))
      .orderBy(desc(goals.createdAt));

    const transformedGoals: Goal[] = [];

    for (const dbGoal of goalsData) {
      const status: Goal["status"] = dbGoal.status as Goal["status"];

      const targetAmount =
        Number.parseFloat(dbGoal.targetAmount) || DEFAULT_AMOUNT;
      const currentAmount =
        Number.parseFloat(dbGoal.currentAmount) || DEFAULT_AMOUNT;

      let deadline: string;
      if (dbGoal.targetDate) {
        deadline = format(dbGoal.targetDate, DATE_FORMAT_PATTERN, {
          locale: es,
        });
      } else {
        deadline = NO_DEADLINE_TEXT;
      }

      const categoryConfig = GOAL_CATEGORIES.find(
        (cat) => cat.value === dbGoal.category
      );
      const categoryLabel = categoryConfig?.label || "Otro";

      transformedGoals.push({
        id: dbGoal.id,
        title: dbGoal.title,
        targetAmount,
        currentAmount,
        deadline,
        category: categoryLabel,
        status,
      });
    }

    return createSuccessResult("Metas obtenidas exitosamente", {
      goals: transformedGoals,
    });
  } catch (error) {
    return handleActionError<Goal[]>(error, []);
  }
}

// Helper function to get dashboard stats (used internally, not exported as action)
export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    const goalsData = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    const activeGoals = goalsData.filter((g) => g.status === "active");
    const totalSaved = goalsData.reduce(
      (sum, g) =>
        sum + Number.parseFloat(g.currentAmount || DEFAULT_AMOUNT_STRING),
      DEFAULT_AMOUNT
    );

    // Calculate average progress
    const avgProgress =
      activeGoals.length > 0
        ? activeGoals.reduce((sum, g) => {
            const target =
              Number.parseFloat(g.targetAmount || DEFAULT_AMOUNT_STRING) ||
              DEFAULT_AMOUNT;
            const current =
              Number.parseFloat(g.currentAmount || DEFAULT_AMOUNT_STRING) ||
              DEFAULT_AMOUNT;
            const progress =
              target > DEFAULT_AMOUNT
                ? (current / target) * PERCENTAGE_MAX
                : DEFAULT_AMOUNT;
            return sum + progress;
          }, DEFAULT_AMOUNT) / activeGoals.length
        : DEFAULT_AMOUNT;

    // Find nearest deadline
    const goalsWithDeadlines = activeGoals.filter((g) => g.targetDate);
    let daysUntilNearest: number | null = null;
    let nearestGoalTitle: string | null = null;

    if (goalsWithDeadlines.length > 0) {
      const now = new Date();
      const nearest = goalsWithDeadlines.reduce((nearest, current) => {
        if (!current.targetDate) return nearest;
        if (!nearest?.targetDate) return current;

        const currentDays = Math.ceil(
          (current.targetDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY
        );
        const nearestDays = Math.ceil(
          (nearest.targetDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY
        );

        return currentDays < nearestDays && currentDays >= 0
          ? current
          : nearest;
      }, goalsWithDeadlines[0]);

      if (nearest?.targetDate) {
        const days = Math.ceil(
          (nearest.targetDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY
        );
        if (days >= DEFAULT_AMOUNT) {
          daysUntilNearest = days;
          nearestGoalTitle = nearest.title;
        }
      }
    }

    return {
      activeGoalsCount: activeGoals.length,
      totalSaved,
      avgProgress,
      daysUntilNearest,
      nearestGoalTitle,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return null;
  }
}
