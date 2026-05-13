import { Router } from "express";
import { authController } from "@/controllers/implements/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { AUTH_ROUTES } from "@/constants/routes.constant";

const authRoute = Router();

authRoute.post(AUTH_ROUTES.SIGN_UP, asyncHandler(authController.signUp))
authRoute.post(AUTH_ROUTES.VERIFY_EMAIL, asyncHandler(authController.verifyEmail))
authRoute.post(AUTH_ROUTES.RESEND_VERIFICATION, asyncHandler(authController.resendVerification));
authRoute.post(AUTH_ROUTES.SIGN_IN, asyncHandler(authController.signIn))
authRoute.post(AUTH_ROUTES.FORGOT_PASSWORD, asyncHandler(authController.forgotPassword))
authRoute.post(AUTH_ROUTES.RESET_PASSWORD, asyncHandler(authController.resetPassword))
authRoute.post(AUTH_ROUTES.LOGOUT, asyncHandler(authController.logOut));

export default authRoute; 