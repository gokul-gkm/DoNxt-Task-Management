import { Express } from "express"
import authRoute from "./auth.routers"
import projectRoute from "./project.routers"
import taskRoute from "./task.routers"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoute),
  app.use("/api/projects", projectRoute)
  app.use("/api/tasks", taskRoute)
}
