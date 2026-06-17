import { userController } from "@/controllers/implements/user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Router } from "express";
import { USER_ROUTES } from "@/constants/routes.constant";
import { validate } from "@/middleware/validation.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/validations/auth.validation";

const userRoute = Router();

userRoute.get(USER_ROUTES.PROFILE, authMiddleware, asyncHandler(userController.getProfile));
userRoute.patch(
  USER_ROUTES.PROFILE,
  authMiddleware,
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);
userRoute.patch(
  USER_ROUTES.PASSWORD,
  authMiddleware,
  validate(changePasswordSchema),
  asyncHandler(userController.changePassword)
);

export default userRoute;