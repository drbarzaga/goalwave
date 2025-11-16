import {
  GOAL_CATEGORIES_VALUES,
  GOAL_PRIORITIES_VALUES,
  GOAL_SAVING_FREQUENCIES_VALUES,
  GOAL_STATUS_VALUES,
  GOAL_TRANSACTION_TYPES_VALUES,
} from "@/lib/constants";
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

//  BETTER-AUTH SCHEMA
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// GOALS SCHEMAS AND ENUMS
export const goalCategories = pgEnum(
  "goal_categories",
  GOAL_CATEGORIES_VALUES as [string, ...string[]]
);

export const goalPriorities = pgEnum(
  "goal_priorities",
  GOAL_PRIORITIES_VALUES as [string, ...string[]]
);

export const goalSavingFrequencies = pgEnum(
  "goal_saving_frequencies",
  GOAL_SAVING_FREQUENCIES_VALUES as [string, ...string[]]
);

export const goalStatuses = pgEnum(
  "goal_statuses",
  GOAL_STATUS_VALUES as [string, ...string[]]
);

export const goalTransactionTypes = pgEnum(
  "goal_transaction_types",
  GOAL_TRANSACTION_TYPES_VALUES as [string, ...string[]]
);

export const goals = pgTable(
  "goals",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    category: goalCategories("category").notNull().default("other"),
    targetAmount: numeric("target_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    currentAmount: numeric("current_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    targetDate: timestamp("target_date"),
    priority: goalPriorities("priority"),
    savingFrequency: goalSavingFrequencies("saving_frequency")
      .notNull()
      .default("monthly"),
    reminderEnabled: boolean("reminder_enabled").notNull().default(false),
    status: goalStatuses("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("idx_user_id").on(table.userId),
    index("idx_status").on(table.status),
    index("idx_category").on(table.category),
    index("idx_priority").on(table.priority),
    index("idx_target_date").on(table.targetDate),
  ]
);

export const goalTransactions = pgTable("goal_transactions", {
  id: text("id").primaryKey(),
  goalId: text("goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  type: goalTransactionTypes("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  goals,
  goalTransactions,
};
