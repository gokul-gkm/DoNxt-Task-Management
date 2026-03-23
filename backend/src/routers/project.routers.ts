import { Router } from "express";

import { projectController } from "@/controllers/implements/project.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { authMiddleware } from "@/middleware/auth.middleware";

const projectRoute = Router();

projectRoute.use(authMiddleware);

projectRoute.post(
  "/",
  asyncHandler(projectController.createProject)
);

projectRoute.get(
  "/",
  asyncHandler(projectController.getProjects)
);

projectRoute.patch(
  "/:id",
  asyncHandler(projectController.updateProject)
);

projectRoute.delete(
  "/:id",
  asyncHandler(projectController.deleteProject)
);

projectRoute.get(
  "/:id/stats",
  asyncHandler(projectController.getProjectStats)
);

export default projectRoute;