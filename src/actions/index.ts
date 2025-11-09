import {
  signInAction,
  signUpAction,
  forgotPasswordAction,
  resetPasswordAction,
} from "./auth";

export const actions = {
  auth: {
    signIn: signInAction,
    signUp: signUpAction,
    forgotPassword: forgotPasswordAction,
    resetPassword: resetPasswordAction,
  },
};
