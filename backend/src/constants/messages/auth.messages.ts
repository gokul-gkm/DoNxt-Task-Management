export const AUTH_MESSAGES = {
  // Success
  SIGNUP_SUCCESS:
    "Success! A verification link was sent to your inbox.",
  EMAIL_VERIFIED: "Email verified successfully",
  VERIFICATION_RESENT:
    "Verification email resent. Please check your inbox.",
  SIGNIN_SUCCESS: "Sign in successfully completed",
  PASSWORD_RESET_LINK_SENT:
    "Password reset link sent to your email.",
  PASSWORD_RESET_SUCCESS:
    "Password reset successfully. You can now sign in.",

  // Errors
  PASSWORD_UNMATCH: "Passwords do not match.",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_NOT_FOUND: "User not found.",
  USER_NOT_FOUND_REGISTER:
    "User not found. Please register again.",
  USER_NOT_VERIFIED:
    "Email not verified. Please verify your email.",
  INVALID_CREDENTIALS: "Invalid credentials",
  INCORRECT_PASSWORD: "Incorrect password",
  EMAIL_ALREADY_VERIFIED:
    "This email is already verified. Please sign in.",
  ALREADY_VERIFIED:
    "Already verified email. Please login.",
  NO_ACCOUNT_FOUND:
    "No account found with this email address.",
  USER_REGISTERED_NOT_VERIFIED:
    "User already registered but not verified. Please verify your email.",
  INVALID_VERIFICATION_LINK:
    "Verification link is invalid or expired. Please request a new one.",
  INVALID_RESET_LINK:
    "Reset link is invalid or expired. Please request a new one.",

  INTERNAL_SERVER_ERROR:
    "Something went wrong. Please try again later.",
  
  PASSWORD_NOT_PROVIDED:
    "Password didn't reach the hashing function",
  PASSWORD_HASH_FAILED:
    "Failed to hash password",
  
  NO_TOKEN_PROVIDED: "Access denied. No token provided",
} as const;