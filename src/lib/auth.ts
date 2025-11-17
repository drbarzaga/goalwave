import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { emailService } from "@/services";
import { getCompanyName } from "./utils";
import VerificationEmail from "@/components/emails/auth/verification-email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 24, // 1 day
    cookieSecure: process.env.NODE_ENV === "production",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes for cache
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await emailService.sendEmail({
        to: user.email,
        from: `${getCompanyName()} <${process.env.RESEND_FROM_EMAIL || "noreply@goalwave.com"}>`,
        subject: "Verify your email address",
        react: VerificationEmail({
          name: user.name,
          verificationUrl: url,
        }),
      });
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies(), lastLoginMethod()],
});
