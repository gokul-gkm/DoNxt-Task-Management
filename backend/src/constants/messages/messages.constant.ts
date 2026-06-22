export const SUCCESS_MESSAGES = {
  SIGNUP: "Signup successful",
  SIGNIN: "Sign in successful",
  LOGOUT: "Logged out successfully",
} as const;

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_TOKEN_REQUIRED: "Email and token required for verification",
  PASSWORD_FIELDS_REQUIRED:
    "Email, token and password fields are required",
  NO_TOKEN_PROVIDED: "No token provided",
  UNAUTHORIZED: "Unauthorized",
  SOMETHING_WENT_WRONG: "Something went wrong",
  VALIDATION_FAILED: "Validation failed"
} as const;

