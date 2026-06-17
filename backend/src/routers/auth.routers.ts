import { Router } from "express";
import { authController } from "@/controllers/implements/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { AUTH_ROUTES } from "@/constants/routes.constant";
import { validate } from "@/middleware/validation.middleware";
import {
  signUpSchema,
  signInSchema,
  forgotSchema,
  resetSchema,
} from "@/validations/auth.validation";

const authRoute = Router();

authRoute.post(
  AUTH_ROUTES.SIGN_UP,
  validate(signUpSchema),
  asyncHandler(authController.signUp)
);
authRoute.post(
  AUTH_ROUTES.VERIFY_EMAIL,
  asyncHandler(authController.verifyEmail)
);
authRoute.post(
  AUTH_ROUTES.RESEND_VERIFICATION,
  validate(forgotSchema),
  asyncHandler(authController.resendVerification)
);
authRoute.post(
  AUTH_ROUTES.SIGN_IN,
  validate(signInSchema),
  asyncHandler(authController.signIn)
);
authRoute.post(
  AUTH_ROUTES.FORGOT_PASSWORD,
  validate(forgotSchema),
  asyncHandler(authController.forgotPassword)
);
authRoute.post(
  AUTH_ROUTES.RESET_PASSWORD,
  validate(resetSchema),
  asyncHandler(authController.resetPassword)
);
authRoute.post(
  AUTH_ROUTES.LOGOUT,
  asyncHandler(authController.logOut)
);

export default authRoute;
 