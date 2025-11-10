"use server";

import {
  createErrorResult,
  createSuccessResult,
  handleActionError,
  validateWithSchema,
} from "@/lib/actions-helpers";
import { auth } from "@/lib/auth";
import { getFullName } from "@/lib/utils";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { ActionResult } from "@/types/core";

// SIGN IN ACTION FUNCTION
export async function signInAction(
  prevState: ActionResult<{ email: string; password: string }> | null,
  formData: FormData
): Promise<ActionResult<{ email: string; password: string }>> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const validation = validateWithSchema(signInSchema, rawData);

    if (!validation.success) {
      return {
        success: false,
        data: rawData,
        fieldErrors: validation.fieldErrors,
      };
    }

    const { email, password } = validation.data;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return createSuccessResult("Signed in successfully", { email, password });
  } catch (error) {
    return handleActionError<{ email: string; password: string }>(error, {
      email: rawData.email,
      password: rawData.password,
    });
  }
}

// SIGN UP ACTION FUNCTION
export async function signUpAction(
  prevState: ActionResult<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }> | null,
  formData: FormData
): Promise<
  ActionResult<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }>
> {
  try {
    const rawData = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = validateWithSchema(signUpSchema, rawData);

    if (!validation.success) {
      return {
        success: false,
        data: rawData,
        fieldErrors: validation.fieldErrors,
      };
    }

    const { firstname, lastname, email, password } = validation.data;

    await auth.api.signUpEmail({
      body: {
        name: getFullName(firstname, lastname),
        email,
        password,
      },
    });

    return createSuccessResult(
      "Account created successfully, please check your email for verification",
      {
        firstname,
        lastname,
        email,
        password,
      }
    );
  } catch (error) {
    return handleActionError<{
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    }>(error);
  }
}

// FORGOT PASSWORD ACTION FUNCTION
export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResult<{ redirectUrl: string }>> {
  console.log(formData);
  return createErrorResult<{ redirectUrl: string }>(
    "Forgot password not implemented"
  );
}

// RESET PASSWORD ACTION FUNCTION
export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResult<{ redirectUrl: string }>> {
  console.log(formData);
  return createErrorResult<{ redirectUrl: string }>(
    "Reset password not implemented"
  );
}
