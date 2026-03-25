import { Express } from "express"
import authRoute from "./auth.routers"
import projectRoute from "./project.routers"
import taskRoute from "./task.routers"
import userRoute from "./user.routers"

export const registerRoutes = (app: Express) => {
  console.log("[RegisterRoutes] Mounting API routes...");
  app.use("/api/auth", authRoute);
  app.use("/api/projects", projectRoute);
  app.use("/api/tasks", taskRoute);
  app.use("/api/users", userRoute);
}
