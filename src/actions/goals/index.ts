"use server";

import { db, sql } from "@/db";
import { goals, goalTransactions } from "@/db/schema";
import {
  createErrorResult,
  createSuccessResult,
  handleActionError,
  validateWithSchema,
} from "@/lib/actions-helpers";
import { auth } from "@/lib/auth";
import {
  createGoalSchema,
  createTransactionSchema,
  updateGoalSchema,
} from "@/lib/validations/goals";
import { ActionResult } from "@/types/core";
import { GoalFormData } from "@/types/goals";
import { desc, eq, and, gte, lt, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { format, formatDistanceToNow } from "date-fns";
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

export async function updateGoalAction(
  prevState: ActionResult<GoalFormData> | null,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return createErrorResult("Unauthorized", {
      message: "Debes iniciar sesión para editar una meta",
    });
  }

  const goalId = formData.get("goalId") as string;
  if (!goalId) {
    return createErrorResult("Validation error", {
      message: "ID de meta requerido",
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
    // Verify goal exists and belongs to user
    const [existingGoal] = await db
      .select()
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (!existingGoal) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    if (existingGoal.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "No tienes permiso para editar esta meta",
      });
    }

    // Check if goal is completed
    if (existingGoal.status === "completed") {
      return createErrorResult("Goal completed", {
        message: "No se puede editar una meta completada",
      });
    }

    const validation = validateWithSchema(updateGoalSchema, {
      ...rawData,
      targetDate: date,
    });

    if (!validation.success) {
      return createErrorResult("Invalid form data", {
        message:
          "Por favor verifica los datos del formulario e intenta de nuevo",
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

    // Business rules for amounts:
    // 1. If targetAmount is reduced below currentAmount, adjust currentAmount
    // 2. Ensure currentAmount doesn't exceed targetAmount
    const existingCurrentAmount = Number.parseFloat(
      existingGoal.currentAmount || "0"
    );
    let finalCurrentAmount = currentAmount;

    // If targetAmount is reduced below existing currentAmount, cap currentAmount to targetAmount
    if (targetAmount < existingCurrentAmount) {
      finalCurrentAmount = targetAmount;
    }

    // Ensure currentAmount doesn't exceed targetAmount (safety check)
    if (finalCurrentAmount > targetAmount) {
      finalCurrentAmount = targetAmount;
    }

    // Ensure currentAmount is not negative
    if (finalCurrentAmount < 0) {
      finalCurrentAmount = 0;
    }

    const [updatedGoal] = await db
      .update(goals)
      .set({
        title,
        description: description || null,
        category,
        targetAmount: targetAmount.toString(),
        currentAmount: finalCurrentAmount.toString(),
        targetDate: targetDate || null,
        priority: priority || null,
        savingFrequency,
        reminderEnabled,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, goalId))
      .returning();

    return createSuccessResult("Meta actualizada exitosamente", {
      goal: updatedGoal,
    });
  } catch (error) {
    return handleActionError<GoalFormData>(error, rawData);
  }
}

export async function deleteGoalAction(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión para eliminar una meta",
      });
    }

    if (!goalId) {
      return createErrorResult("Validation error", {
        message: "ID de meta requerido",
      });
    }

    // Verify goal exists and belongs to user
    const [existingGoal] = await db
      .select()
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (!existingGoal) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    if (existingGoal.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "No tienes permiso para eliminar esta meta",
      });
    }

    // Delete goal transactions first (cascade should handle this, but being explicit)
    await db
      .delete(goalTransactions)
      .where(eq(goalTransactions.goalId, goalId));

    // Delete the goal
    await db.delete(goals).where(eq(goals.id, goalId));

    return createSuccessResult("Meta eliminada exitosamente", {
      goalId,
    });
  } catch (error) {
    return handleActionError<string>(error, goalId);
  }
}

// Get goal title by ID (for breadcrumb)
export async function getGoalTitleAction(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión",
      });
    }

    const goalData = await db
      .select({ title: goals.title })
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (goalData.length === 0) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    return createSuccessResult("Título obtenido exitosamente", {
      title: goalData[0].title,
    });
  } catch (error) {
    return handleActionError<string>(error, "");
  }
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

// Wrapper for useActionState (accepts FormData)
export async function createTransactionFormAction(
  prevState: ActionResult<{ transactionId: string }> | null,
  formData: FormData
): Promise<ActionResult<{ transactionId: string }>> {
  const goalId = formData.get("goalId") as string;
  const type = formData.get("type") as "deposit" | "withdrawal";
  const amount = formData.get("amount") as string;
  const description = formData.get("description") as string | null;

  if (!goalId || !type || !amount) {
    return createErrorResult("Validation error", {
      message: "Faltan campos requeridos",
    });
  }

  return createTransactionAction(goalId, {
    type,
    amount: Number.parseFloat(amount),
    description: description || undefined,
  });
}

// Original action (can be called directly)
export async function createTransactionAction(
  goalId: string,
  data: {
    type: "deposit" | "withdrawal";
    amount: number;
    description?: string;
  }
): Promise<ActionResult<{ transactionId: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "You must be logged in to create a transaction",
      });
    }

    // Validate input
    const validation = createTransactionSchema.safeParse({
      type: data.type,
      amount: data.amount.toString(),
      description: data.description,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return createErrorResult("Validation error", {
        message: firstError?.message || "Invalid transaction data",
      });
    }

    // Verify goal exists and belongs to user
    const [goal] = await db.select().from(goals).where(eq(goals.id, goalId));

    if (!goal) {
      return createErrorResult("Not found", {
        message: "Goal not found",
      });
    }

    if (goal.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "You don't have permission to modify this goal",
      });
    }

    // Check if goal is completed
    if (goal.status === "completed") {
      return createErrorResult("Goal completed", {
        message: "No se pueden agregar transacciones a una meta completada",
      });
    }

    // Check if withdrawal would result in negative balance
    const currentAmount = Number.parseFloat(goal.currentAmount || "0");
    const transactionAmount = validation.data.amount;

    if (
      validation.data.type === "withdrawal" &&
      currentAmount < transactionAmount
    ) {
      return createErrorResult("Insufficient funds", {
        message: "No tienes suficientes fondos para realizar este retiro",
      });
    }

    // Create transaction and update goal atomically
    // Using sql.transaction() for neon-http driver (non-interactive transaction)
    const transactionId = crypto.randomUUID();
    const newAmount =
      validation.data.type === "deposit"
        ? currentAmount + transactionAmount
        : currentAmount - transactionAmount;

    await sql.transaction([
      // Create transaction record
      sql`INSERT INTO goal_transactions (id, goal_id, amount, type, description, created_at, updated_at)
          VALUES (${transactionId}, ${goalId}, ${transactionAmount.toString()}, ${validation.data.type}, ${validation.data.description || null}, NOW(), NOW())`,
      // Update goal current amount
      sql`UPDATE goals 
          SET current_amount = ${newAmount.toString()}, updated_at = NOW()
          WHERE id = ${goalId}`,
    ]);

    const result = { transactionId };

    return createSuccessResult("Transaction created successfully", result);
  } catch (error) {
    return handleActionError<{ transactionId: string }>(error, {
      transactionId: "",
    });
  }
}

// Get goal details by ID
export async function getGoalByIdAction(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión",
      });
    }

    const [goalData] = await db
      .select()
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (!goalData) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    // Verify ownership
    if (goalData.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "No tienes permiso para ver esta meta",
      });
    }

    const targetAmount =
      Number.parseFloat(goalData.targetAmount) || DEFAULT_AMOUNT;
    const currentAmount =
      Number.parseFloat(goalData.currentAmount) || DEFAULT_AMOUNT;

    let deadline: string | undefined;
    if (goalData.targetDate) {
      deadline = format(goalData.targetDate, DATE_FORMAT_PATTERN, {
        locale: es,
      });
    }

    return createSuccessResult("Meta obtenida exitosamente", {
      id: goalData.id,
      title: goalData.title,
      description: goalData.description || undefined,
      category: goalData.category,
      targetAmount,
      currentAmount,
      deadline,
      createdAt: goalData.createdAt.toISOString(),
      status: goalData.status,
      priority: goalData.priority || undefined,
      savingFrequency: goalData.savingFrequency,
      reminderEnabled: goalData.reminderEnabled,
    });
  } catch (error) {
    return handleActionError<null>(error, null);
  }
}

// Get transactions for a goal
export async function getGoalTransactionsAction(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión",
      });
    }

    // Verify goal exists and belongs to user
    const [goal] = await db
      .select({ userId: goals.userId })
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (!goal) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    if (goal.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "No tienes permiso para ver las transacciones de esta meta",
      });
    }

    const transactionsData = await db
      .select()
      .from(goalTransactions)
      .where(eq(goalTransactions.goalId, goalId))
      .orderBy(desc(goalTransactions.createdAt));

    const transactions = transactionsData.map((tx) => ({
      id: tx.id,
      type: tx.type as "deposit" | "withdrawal",
      amount: Number.parseFloat(tx.amount) || 0,
      date: tx.createdAt.toISOString(),
      description: tx.description || undefined,
    }));

    return createSuccessResult("Transacciones obtenidas exitosamente", {
      transactions,
      total: transactions.length,
    });
  } catch (error) {
    return handleActionError<{ transactions: never[]; total: number }>(error, {
      transactions: [],
      total: 0,
    });
  }
}

export type Achievement = {
  id: string;
  title: string;
  description: string;
  completedAt: Date;
  formattedDate: string;
};

export async function getRecentAchievementsAction(limit: number = 5) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<{ achievements: Achievement[] }>(
        "Debes iniciar sesión para ver tus logros",
        { achievements: [] }
      );
    }

    const completedGoals = await db
      .select()
      .from(goals)
      .where(
        and(eq(goals.userId, session.user.id), eq(goals.status, "completed"))
      )
      .orderBy(desc(goals.updatedAt))
      .limit(limit);

    const achievements: Achievement[] = completedGoals.map((goal) => {
      const completedAt = goal.updatedAt || goal.createdAt;
      const formattedDate = formatDistanceToNow(completedAt, {
        addSuffix: true,
        locale: es,
      });

      return {
        id: goal.id,
        title: goal.title,
        description: `Completaste tu meta: ${goal.title}`,
        completedAt,
        formattedDate:
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      };
    });

    return createSuccessResult("Logros obtenidos exitosamente", {
      achievements,
    });
  } catch (error) {
    return handleActionError<{ achievements: Achievement[] }>(error, {
      achievements: [],
    });
  }
}

export async function markGoalAsCompletedAction(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult("Unauthorized", {
        message: "Debes iniciar sesión para completar una meta",
      });
    }

    // Verify goal exists and belongs to user
    const [existingGoal] = await db
      .select()
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1);

    if (!existingGoal) {
      return createErrorResult("Not Found", {
        message: "Meta no encontrada",
      });
    }

    if (existingGoal.userId !== session.user.id) {
      return createErrorResult("Forbidden", {
        message: "No tienes permiso para completar esta meta",
      });
    }

    if (existingGoal.status === "completed") {
      return createErrorResult("Already completed", {
        message: "Esta meta ya está completada",
      });
    }

    // Update goal status to completed
    const [updatedGoal] = await db
      .update(goals)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(goals.id, goalId))
      .returning();

    return createSuccessResult("¡Meta completada! Has alcanzado tu objetivo", {
      goal: updatedGoal,
    });
  } catch (error) {
    return handleActionError(error, null);
  }
}

export type MonthlySummary = {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  incomePercentage: number;
  expensesPercentage: number;
  savingsPercentage: number;
};

export async function getMonthlySummaryAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<MonthlySummary>("Unauthorized", {
        message: "Debes iniciar sesión para ver el resumen mensual",
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        incomePercentage: 0,
        expensesPercentage: 0,
        savingsPercentage: 0,
      });
    }

    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get all user's goals
    const userGoals = await db
      .select({ id: goals.id })
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    const goalIds = userGoals.map((g) => g.id);

    if (goalIds.length === 0) {
      return createSuccessResult("Resumen mensual obtenido exitosamente", {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        incomePercentage: 0,
        expensesPercentage: 0,
        savingsPercentage: 0,
      });
    }

    // Get all transactions for this month
    const monthlyTransactions = await db
      .select({
        type: goalTransactions.type,
        amount: goalTransactions.amount,
      })
      .from(goalTransactions)
      .where(
        and(
          inArray(goalTransactions.goalId, goalIds),
          gte(goalTransactions.createdAt, startOfMonth),
          lt(goalTransactions.createdAt, startOfNextMonth)
        )
      );

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of monthlyTransactions) {
      const amount = Number.parseFloat(transaction.amount || "0");
      if (transaction.type === "deposit") {
        totalIncome += amount;
      } else if (transaction.type === "withdrawal") {
        totalExpenses += amount;
      }
    }

    const totalSavings = totalIncome - totalExpenses;

    const incomePercentage = totalIncome > 0 ? PERCENTAGE_MAX : 0;
    const expensesPercentage =
      totalIncome > 0
        ? Math.round((totalExpenses / totalIncome) * PERCENTAGE_MAX)
        : 0;
    const savingsPercentage =
      totalIncome > 0
        ? Math.round((totalSavings / totalIncome) * PERCENTAGE_MAX)
        : 0;

    return createSuccessResult("Resumen mensual obtenido exitosamente", {
      totalIncome,
      totalExpenses,
      totalSavings,
      incomePercentage,
      expensesPercentage,
      savingsPercentage,
    });
  } catch (error) {
    return handleActionError<MonthlySummary>(error, {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      incomePercentage: 0,
      expensesPercentage: 0,
      savingsPercentage: 0,
    });
  }
}
