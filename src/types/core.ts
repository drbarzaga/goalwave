// TYPE FOR SERVER ACTIONS RESPONSES
export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
