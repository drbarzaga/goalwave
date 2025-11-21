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

// Reports Actions
export type MonthlyComparison = {
  currentMonth: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    savingsRate: number;
  };
  previousMonth: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    savingsRate: number;
  };
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
  savingsRateChange: number;
};

export async function getReportsSummaryAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<MonthlyComparison>("Unauthorized", {
        message: "Debes iniciar sesión para ver los reportes",
        currentMonth: {
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          savingsRate: 0,
        },
        previousMonth: {
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          savingsRate: 0,
        },
        incomeChange: 0,
        expensesChange: 0,
        savingsChange: 0,
        savingsRateChange: 0,
      });
    }

    // Get all user's goals
    const userGoals = await db
      .select({ id: goals.id })
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    const goalIds = userGoals.map((g) => g.id);

    if (goalIds.length === 0) {
      return createSuccessResult("Resumen obtenido exitosamente", {
        currentMonth: {
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          savingsRate: 0,
        },
        previousMonth: {
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          savingsRate: 0,
        },
        incomeChange: 0,
        expensesChange: 0,
        savingsChange: 0,
        savingsRateChange: 0,
      });
    }

    const now = new Date();

    // Current month
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Previous month
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get current month transactions
    const currentMonthTransactions = await db
      .select({
        type: goalTransactions.type,
        amount: goalTransactions.amount,
      })
      .from(goalTransactions)
      .where(
        and(
          inArray(goalTransactions.goalId, goalIds),
          gte(goalTransactions.createdAt, startOfCurrentMonth),
          lt(goalTransactions.createdAt, startOfNextMonth)
        )
      );

    // Get previous month transactions
    const previousMonthTransactions = await db
      .select({
        type: goalTransactions.type,
        amount: goalTransactions.amount,
      })
      .from(goalTransactions)
      .where(
        and(
          inArray(goalTransactions.goalId, goalIds),
          gte(goalTransactions.createdAt, startOfPreviousMonth),
          lt(goalTransactions.createdAt, endOfPreviousMonth)
        )
      );

    // Calculate current month totals
    let currentIncome = 0;
    let currentExpenses = 0;
    for (const transaction of currentMonthTransactions) {
      const amount = Number.parseFloat(transaction.amount || "0");
      if (transaction.type === "deposit") {
        currentIncome += amount;
      } else if (transaction.type === "withdrawal") {
        currentExpenses += amount;
      }
    }
    const currentSavings = currentIncome - currentExpenses;
    const currentSavingsRate =
      currentIncome > 0
        ? Math.round((currentSavings / currentIncome) * PERCENTAGE_MAX * 10) /
          10
        : 0;

    // Calculate previous month totals
    let previousIncome = 0;
    let previousExpenses = 0;
    for (const transaction of previousMonthTransactions) {
      const amount = Number.parseFloat(transaction.amount || "0");
      if (transaction.type === "deposit") {
        previousIncome += amount;
      } else if (transaction.type === "withdrawal") {
        previousExpenses += amount;
      }
    }
    const previousSavings = previousIncome - previousExpenses;
    const previousSavingsRate =
      previousIncome > 0
        ? Math.round((previousSavings / previousIncome) * PERCENTAGE_MAX * 10) /
          10
        : 0;

    // Calculate changes
    const incomeChange =
      previousIncome > 0
        ? Math.round(
            ((currentIncome - previousIncome) / previousIncome) *
              PERCENTAGE_MAX *
              10
          ) / 10
        : currentIncome > 0
          ? 100
          : 0;
    const expensesChange =
      previousExpenses > 0
        ? Math.round(
            ((currentExpenses - previousExpenses) / previousExpenses) *
              PERCENTAGE_MAX *
              10
          ) / 10
        : currentExpenses > 0
          ? 100
          : 0;
    const savingsChange =
      previousSavings !== 0
        ? Math.round(
            ((currentSavings - previousSavings) / Math.abs(previousSavings)) *
              PERCENTAGE_MAX *
              10
          ) / 10
        : currentSavings > 0
          ? 100
          : 0;
    const savingsRateChange = currentSavingsRate - previousSavingsRate;

    return createSuccessResult("Resumen obtenido exitosamente", {
      currentMonth: {
        totalIncome: currentIncome,
        totalExpenses: currentExpenses,
        totalSavings: currentSavings,
        savingsRate: currentSavingsRate,
      },
      previousMonth: {
        totalIncome: previousIncome,
        totalExpenses: previousExpenses,
        totalSavings: previousSavings,
        savingsRate: previousSavingsRate,
      },
      incomeChange,
      expensesChange,
      savingsChange,
      savingsRateChange,
    });
  } catch (error) {
    return handleActionError<MonthlyComparison>(error, {
      currentMonth: {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        savingsRate: 0,
      },
      previousMonth: {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        savingsRate: 0,
      },
      incomeChange: 0,
      expensesChange: 0,
      savingsChange: 0,
      savingsRateChange: 0,
    });
  }
}

export type MonthlyDataPoint = {
  month: string;
  monthShort: string;
  income: number;
  expenses: number;
  savings: number;
};

export async function getMonthlyAnalysisAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<MonthlyDataPoint[]>("Unauthorized", {
        message: "Debes iniciar sesión para ver el análisis mensual",
        data: [],
      });
    }

    // Get all user's goals
    const userGoals = await db
      .select({ id: goals.id })
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    const goalIds = userGoals.map((g) => g.id);

    if (goalIds.length === 0) {
      return createSuccessResult("Análisis mensual obtenido exitosamente", {
        data: [],
      });
    }

    const now = new Date();
    const monthlyData: MonthlyDataPoint[] = [];

    // Get data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      const monthTransactions = await db
        .select({
          type: goalTransactions.type,
          amount: goalTransactions.amount,
        })
        .from(goalTransactions)
        .where(
          and(
            inArray(goalTransactions.goalId, goalIds),
            gte(goalTransactions.createdAt, monthDate),
            lt(goalTransactions.createdAt, nextMonthDate)
          )
        );

      let income = 0;
      let expenses = 0;
      for (const transaction of monthTransactions) {
        const amount = Number.parseFloat(transaction.amount || "0");
        if (transaction.type === "deposit") {
          income += amount;
        } else if (transaction.type === "withdrawal") {
          expenses += amount;
        }
      }

      const savings = income - expenses;
      const monthName = format(monthDate, "MMMM", { locale: es });
      const monthShort = format(monthDate, "MMM", { locale: es });

      monthlyData.push({
        month: monthName,
        monthShort: monthShort.charAt(0).toUpperCase() + monthShort.slice(1),
        income,
        expenses,
        savings,
      });
    }

    return createSuccessResult("Análisis mensual obtenido exitosamente", {
      data: monthlyData,
    });
  } catch (error) {
    return handleActionError<{ data: MonthlyDataPoint[] }>(error, {
      data: [],
    });
  }
}

export type CategoryReport = {
  category: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  goalCount: number;
};

export async function getCategoryReportsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<{ data: CategoryReport[] }>("Unauthorized", {
        message: "Debes iniciar sesión para ver los reportes por categoría",
        data: [],
      });
    }

    // Get all user's goals with their categories
    const userGoals = await db
      .select({
        id: goals.id,
        category: goals.category,
      })
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    if (userGoals.length === 0) {
      return createSuccessResult(
        "Reportes por categoría obtenidos exitosamente",
        {
          data: [],
        }
      );
    }

    const categoryMap = new Map<string, string[]>();

    for (const goal of userGoals) {
      const category = goal.category || "other";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(goal.id);
    }

    const categoryReports: CategoryReport[] = [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    for (const [category, catGoalIds] of categoryMap.entries()) {
      const categoryTransactions = await db
        .select({
          type: goalTransactions.type,
          amount: goalTransactions.amount,
        })
        .from(goalTransactions)
        .where(
          and(
            inArray(goalTransactions.goalId, catGoalIds),
            gte(goalTransactions.createdAt, startOfMonth),
            lt(goalTransactions.createdAt, startOfNextMonth)
          )
        );

      let totalIncome = 0;
      let totalExpenses = 0;
      for (const transaction of categoryTransactions) {
        const amount = Number.parseFloat(transaction.amount || "0");
        if (transaction.type === "deposit") {
          totalIncome += amount;
        } else if (transaction.type === "withdrawal") {
          totalExpenses += amount;
        }
      }

      const categoryConfig = GOAL_CATEGORIES.find(
        (cat) => cat.value === category
      );
      const categoryLabel = categoryConfig?.label || "Otro";

      categoryReports.push({
        category: categoryLabel,
        totalIncome,
        totalExpenses,
        totalSavings: totalIncome - totalExpenses,
        goalCount: catGoalIds.length,
      });
    }

    const sortedCategoryReports = [...categoryReports].sort(
      (a, b) => b.totalSavings - a.totalSavings
    );

    return createSuccessResult(
      "Reportes por categoría obtenidos exitosamente",
      {
        data: sortedCategoryReports,
      }
    );
  } catch (error) {
    return handleActionError<{ data: CategoryReport[] }>(error, {
      data: [],
    });
  }
}

export type GoalProgressReport = {
  goalId: string;
  title: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  status: string;
};

export async function getGoalProgressReportsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<{ data: GoalProgressReport[] }>("Unauthorized", {
        message: "Debes iniciar sesión para ver el progreso de metas",
        data: [],
      });
    }

    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, session.user.id))
      .orderBy(desc(goals.createdAt));

    const progressReports: GoalProgressReport[] = [];

    for (const dbGoal of userGoals) {
      const targetAmount =
        Number.parseFloat(dbGoal.targetAmount) || DEFAULT_AMOUNT;
      const currentAmount =
        Number.parseFloat(dbGoal.currentAmount) || DEFAULT_AMOUNT;
      const progress =
        targetAmount > 0
          ? Math.round((currentAmount / targetAmount) * PERCENTAGE_MAX * 10) /
            10
          : 0;

      const categoryConfig = GOAL_CATEGORIES.find(
        (cat) => cat.value === dbGoal.category
      );
      const categoryLabel = categoryConfig?.label || "Otro";

      progressReports.push({
        goalId: dbGoal.id,
        title: dbGoal.title,
        category: categoryLabel,
        currentAmount,
        targetAmount,
        progress: Math.min(progress, PERCENTAGE_MAX),
        status: dbGoal.status as string,
      });
    }

    return createSuccessResult("Progreso de metas obtenido exitosamente", {
      data: progressReports,
    });
  } catch (error) {
    return handleActionError<{ data: GoalProgressReport[] }>(error, {
      data: [],
    });
  }
}

// Activity Actions
export type ActivityTransaction = {
  id: string;
  goalId: string;
  goalTitle: string;
  goalCategory: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description?: string;
  createdAt: string;
};

export async function getAllTransactionsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return createErrorResult<{ data: ActivityTransaction[] }>(
        "Unauthorized",
        {
          message: "Debes iniciar sesión para ver la actividad",
          data: [],
        }
      );
    }

    // Get all user's goals
    const userGoals = await db
      .select({
        id: goals.id,
        title: goals.title,
        category: goals.category,
      })
      .from(goals)
      .where(eq(goals.userId, session.user.id));

    const goalIds = userGoals.map((g) => g.id);

    if (goalIds.length === 0) {
      return createSuccessResult("Actividad obtenida exitosamente", {
        data: [],
      });
    }

    // Get all transactions for user's goals
    const transactionsData = await db
      .select({
        id: goalTransactions.id,
        goalId: goalTransactions.goalId,
        type: goalTransactions.type,
        amount: goalTransactions.amount,
        description: goalTransactions.description,
        createdAt: goalTransactions.createdAt,
      })
      .from(goalTransactions)
      .where(inArray(goalTransactions.goalId, goalIds))
      .orderBy(desc(goalTransactions.createdAt))
      .limit(100); // Limit to last 100 transactions

    // Create a map of goal IDs to goal info
    const goalMap = new Map(
      userGoals.map((g) => [
        g.id,
        {
          title: g.title,
          category: g.category || "other",
        },
      ])
    );

    const categoryConfigs = new Map(
      GOAL_CATEGORIES.map((cat) => [cat.value, cat.label])
    );

    const transactions: ActivityTransaction[] = transactionsData.map((tx) => {
      const goalInfo = goalMap.get(tx.goalId);
      const categoryLabel =
        categoryConfigs.get(goalInfo?.category || "other") || "Otro";

      return {
        id: tx.id,
        goalId: tx.goalId,
        goalTitle: goalInfo?.title || "Meta desconocida",
        goalCategory: categoryLabel,
        type: tx.type as "deposit" | "withdrawal",
        amount: Number.parseFloat(tx.amount) || 0,
        description: tx.description || undefined,
        createdAt: tx.createdAt.toISOString(),
      };
    });

    return createSuccessResult("Actividad obtenida exitosamente", {
      data: transactions,
    });
  } catch (error) {
    return handleActionError<{ data: ActivityTransaction[] }>(error, {
      data: [],
    });
  }
}
