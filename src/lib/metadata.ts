import type { Metadata } from "next";
import { getCompanyDescription, getCompanyName } from "./utils";

const appName = getCompanyName() || "Goalwave";
const appDescription = getCompanyDescription() || "";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Helper function to create page metadata with consistent structure
 */
export function createPageMetadata({
  title,
  description,
  keywords,
  openGraph,
  twitter,
  noindex = false,
  nofollow = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    type?: "website" | "article";
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    images?: string[];
  };
  noindex?: boolean;
  nofollow?: boolean;
}): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(", "),
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      siteName: appName,
      images: openGraph?.images || [],
      type: openGraph?.type || "website",
      url: baseUrl,
    },
    twitter: {
      card: twitter?.card || "summary_large_image",
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images || [],
    },
  };

  return metadata;
}

/**
 * Predefined metadata for common pages
 */
export const pageMetadata = {
  home: (): Metadata =>
    createPageMetadata({
      title: `Home`,
      description:
        appDescription ||
        "Achieve your financial goals with GoalWave. Track your progress, set milestones, and reach your dreams.",
      keywords: [
        "financial goals",
        "goal tracking",
        "personal finance",
        "savings",
      ],
      openGraph: {
        type: "website",
      },
    }),

  login: (): Metadata =>
    createPageMetadata({
      title: "Sign In",
      description: `Sign in to your ${appName} account to continue tracking your financial goals.`,
      keywords: ["login", "sign in", "account"],
      noindex: true, // Login pages typically shouldn't be indexed
    }),

  signup: (): Metadata =>
    createPageMetadata({
      title: "Sign Up",
      description: `Create a new ${appName} account and start achieving your financial goals today.`,
      keywords: ["sign up", "register", "create account"],
      noindex: true, // Sign up pages typically shouldn't be indexed
    }),

  forgotPassword: (): Metadata =>
    createPageMetadata({
      title: "Forgot Password",
      description: `Reset your ${appName} account password. We'll help you regain access to your account.`,
      keywords: ["forgot password", "reset password", "password recovery"],
      noindex: true, // Password reset pages shouldn't be indexed
    }),

  dashboard: (): Metadata =>
    createPageMetadata({
      title: "Dashboard",
      description: `Dashboard of your ${appName} account.`,
      keywords: ["dashboard", "account"],
      noindex: true,
    }),

  reports: (): Metadata =>
    createPageMetadata({
      title: "Reportes",
      description: `Analiza tu progreso financiero y toma decisiones informadas con los reportes de ${appName}.`,
      keywords: ["reportes", "análisis financiero", "estadísticas", "progreso"],
      noindex: true,
    }),

  activity: (): Metadata =>
    createPageMetadata({
      title: "Actividad",
      description: `Historial completo de todas tus transacciones financieras en ${appName}.`,
      keywords: ["actividad", "transacciones", "historial", "movimientos"],
      noindex: true,
    }),

  tips: (): Metadata =>
    createPageMetadata({
      title: "Consejos Financieros",
      description: `Aprende estrategias y mejores prácticas para alcanzar tus objetivos financieros con ${appName}.`,
      keywords: ["consejos", "tips", "finanzas personales", "educación financiera"],
      noindex: true,
    }),

  settings: (): Metadata =>
    createPageMetadata({
      title: "Configuración",
      description: `Gestiona tu cuenta y preferencias en ${appName}.`,
      keywords: ["configuración", "ajustes", "perfil", "cuenta"],
      noindex: true,
    }),
};
