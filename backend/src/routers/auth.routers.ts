import { authController } from "@/controllers/implements/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Router } from "express"

const authRoute = Router();

authRoute.post('/sign-up', asyncHandler(authController.signUp))
authRoute.post('/verify-email', asyncHandler(authController.verifyEmail))
authRoute.post('/resend-verification', asyncHandler(authController.resendVerification));
authRoute.post('/sign-in', asyncHandler(authController.signIn))
authRoute.post('/forgot-password', asyncHandler(authController.forgotPassword))
authRoute.post('/reset-password', asyncHandler(authController.resetPassword))
authRoute.post('/logout', asyncHandler(authController.logOut))

export default authRoute;