export const AUTH_ROUTES = {
  SIGN_UP: "/sign-up",
  VERIFY_EMAIL: "/verify-email",
  RESEND_VERIFICATION: "/resend-verification",
  SIGN_IN: "/sign-in",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  LOGOUT: "/logout",
} as const;

export const PROJECT_ROUTES = {
  BASE: "/",
  BY_ID: "/:id",
  STATS: "/:id/stats",
} as const;

export const TASK_ROUTES = {
  BASE: "/",
  ANALYTICS: "/analytics",
  BY_ID: "/:id",
} as const;

export const USER_ROUTES = {
  PROFILE: "/profile",
  PASSWORD: "/password",
} as const;