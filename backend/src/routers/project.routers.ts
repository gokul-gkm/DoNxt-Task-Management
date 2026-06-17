import { Router } from "express";

import { projectController } from "@/controllers/implements/project.controller";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { authMiddleware } from "@/middleware/auth.middleware";
import { PROJECT_ROUTES } from "@/constants/routes.constant";
import { validate } from "@/middleware/validation.middleware";
import { projectSchema } from "@/validations/project.validation";

const projectRoute = Router();

projectRoute.use(authMiddleware);

projectRoute.get(
  PROJECT_ROUTES.BY_ID,
  asyncHandler(projectController.getProjectById)
);

projectRoute.post(
  PROJECT_ROUTES.BASE,
  validate(projectSchema),
  asyncHandler(projectController.createProject)
);

projectRoute.get(
  PROJECT_ROUTES.BASE,
  asyncHandler(projectController.getProjects)
);

projectRoute.patch(
  PROJECT_ROUTES.BY_ID,
  validate(projectSchema.partial()),
  asyncHandler(projectController.updateProject)
);

projectRoute.delete(
  PROJECT_ROUTES.BY_ID,
  asyncHandler(projectController.deleteProject)
);

projectRoute.get(
  PROJECT_ROUTES.STATS,
  asyncHandler(projectController.getProjectStats)
);

export default projectRoute;