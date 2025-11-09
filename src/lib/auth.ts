import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
// import { Resend } from "resend";
// import VerificationEmail from "@/components/emails/verification-email";
// import PasswordResetEmail from "@/components/emails/password-reset-email";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // sendResetPassword: async ({ user, url }) => {
    //   await resend.emails.send({
    //     from: "NoteForge <onboarding@resend.dev>",
    //     to: [user.email],
    //     subject: "Reset your password",
    //     react: PasswordResetEmail({
    //       userName: user.name,
    //       userEmail: user.email,
    //       expirationTime: "1 hour",
    //       resetUrl: url,
    //     }),
    //   });
    // },
  },
  emailVerification: {
    // sendVerificationEmail: async ({ user, url }) => {
    //   await resend.emails.send({
    //     from: "NoteForge <onboarding@resend.dev>",
    //     to: [user.email],
    //     subject: "Verify your email address",
    //     react: VerificationEmail({
    //       userName: user.name,
    //       verificationUrl: url,
    //     }),
    //   });
    // },
    sendOnSignUp: true,
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
