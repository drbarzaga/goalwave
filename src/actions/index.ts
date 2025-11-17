import {
  signInAction,
  signUpAction,
  forgotPasswordAction,
  resetPasswordAction,
} from "./auth";

import {
  createGoalAction,
  updateGoalAction,
  deleteGoalAction,
  getGoalsAction,
  getGoalTitleAction,
  createTransactionAction,
  createTransactionFormAction,
  getGoalByIdAction,
  getGoalTransactionsAction,
  getRecentAchievementsAction,
  markGoalAsCompletedAction,
  getMonthlySummaryAction,
} from "./goals";

export const actions = {
  auth: {
    signIn: signInAction,
    signUp: signUpAction,
    forgotPassword: forgotPasswordAction,
    resetPassword: resetPasswordAction,
  },
  goals: {
    create: createGoalAction,
    update: updateGoalAction,
    delete: deleteGoalAction,
    get: getGoalsAction,
    getTitle: getGoalTitleAction,
    getById: getGoalByIdAction,
    getTransactions: getGoalTransactionsAction,
    createTransaction: createTransactionAction,
    createTransactionForm: createTransactionFormAction,
    getRecentAchievements: getRecentAchievementsAction,
    markAsCompleted: markGoalAsCompletedAction,
    getMonthlySummary: getMonthlySummaryAction,
  },
};
