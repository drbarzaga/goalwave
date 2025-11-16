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
import { headers } from "next/headers";

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
  // TODO: Implement the get goals action
}
