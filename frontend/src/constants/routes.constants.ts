export const AUTH_ROUTES = {
  SIGN_UP: "/auth/sign-up",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  SIGN_IN: "/auth/sign-in",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
} as const;

export const PROJECT_ROUTES = {
  BASE: "/projects",
  BY_ID: "/projects/:id",
  STATS: "stats",
} as const;

export const TASK_ROUTES = {
  BASE: "/tasks/",
  ANALYTICS: "/tasks/analytics",
  BY_ID: "/tasks/:id",
} as const;

export const USER_ROUTES = {
  PROFILE: "/users/profile",
  PASSWORD: "/users/password",
} as const;