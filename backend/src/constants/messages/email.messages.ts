export const EMAIL_MESSAGES = {
  // Subjects
  VERIFY_EMAIL_SUBJECT: "Verify your DoNxt email",
  RESET_PASSWORD_SUBJECT: "Reset your DoNxt password",

  // Errors
  EMAIL_SEND_FAILED: "Failed to send email",
  VERIFICATION_EMAIL_SEND_FAILED:
    "Failed to send verification email",
  PASSWORD_RESET_EMAIL_SEND_FAILED:
    "Failed to send password reset email",

  MISSING_EMAIL_CONFIG:
    "Missing required environment variables for email sending.",
} as const;