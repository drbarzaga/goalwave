import { z } from "zod";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants";

// Client-side validation schema for sign in
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    }),
});

// Client-side validation schema for sign up
export const signUpSchema = z.object({
  firstname: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(20, { message: "First name must be less than 20 characters" }),
  lastname: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name is required" })
    .max(20, { message: "Last name must be less than 20 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
    }),
});

// Client-side validation schema for forgot password
export const forgotPasswordSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

// Client-side validation schema for reset password
export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
      }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
