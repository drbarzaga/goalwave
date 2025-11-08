import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Goalwave";
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "";
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
};
