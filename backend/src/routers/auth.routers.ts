import { authController } from "@/controllers/implements/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Router } from "express"

const authRoute = Router();

authRoute.post('/sign-up', asyncHandler(authController.signUp))
authRoute.post('/verify-email', asyncHandler(authController.verifyEmail))
authRoute.post('/resend-verification', asyncHandler(authController.resendVerification));


export default authRoute;