import { Router } from "express";

import { taskController } from "@/controllers/implements/task.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { authMiddleware } from "@/middleware/auth.middleware";
import { TASK_ROUTES } from "@/constants/routes.constant";
import { validate } from "@/middleware/validation.middleware";
import { taskSchema } from "@/validations/task.validation";

const taskRoute = Router();

taskRoute.use(authMiddleware);

taskRoute.get(TASK_ROUTES.ANALYTICS, asyncHandler(taskController.getAnalytics));
taskRoute.post(
  TASK_ROUTES.BASE,
  validate(taskSchema),
  asyncHandler(taskController.createTask)
);
taskRoute.get(TASK_ROUTES.BASE, asyncHandler(taskController.getTasks));
taskRoute.patch(
  TASK_ROUTES.BY_ID,
  validate(taskSchema.partial()),
  asyncHandler(taskController.updateTask)
);
taskRoute.delete(TASK_ROUTES.BY_ID, asyncHandler(taskController.deleteTask));

export default taskRoute;