import { userController } from "@/controllers/implements/user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Router } from "express";
import { USER_ROUTES } from "@/constants/routes.constant";

const userRoute = Router();

userRoute.get(USER_ROUTES.PROFILE, authMiddleware, asyncHandler(userController.getProfile));
userRoute.patch(USER_ROUTES.PROFILE, authMiddleware, asyncHandler(userController.updateProfile));
userRoute.patch(USER_ROUTES.PASSWORD, authMiddleware, asyncHandler(userController.changePassword));

export default userRoute;