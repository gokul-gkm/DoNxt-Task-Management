import { Router } from "express";

import { taskController } from "@/controllers/implements/task.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { authMiddleware } from "@/middleware/auth.middleware";

const taskRoute = Router();

taskRoute.use(authMiddleware);

taskRoute.get("/analytics", asyncHandler(taskController.getAnalytics));
taskRoute.post("/", asyncHandler(taskController.createTask));
taskRoute.get("/", asyncHandler(taskController.getTasks));
taskRoute.patch("/:id", asyncHandler(taskController.updateTask));
taskRoute.delete("/:id", asyncHandler(taskController.deleteTask));

export default taskRoute;