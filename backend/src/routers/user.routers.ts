import { userController } from "@/controllers/implements/user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Router } from "express";

const userRoute = Router();

userRoute.get("/profile", authMiddleware, asyncHandler(userController.getProfile));
userRoute.patch("/profile", authMiddleware, asyncHandler(userController.updateProfile));
userRoute.patch("/password", authMiddleware, asyncHandler(userController.changePassword));

export default userRoute;