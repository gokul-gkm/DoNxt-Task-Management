import { Express } from "express"
import authRoute from "./auth.routers"
import projectRoute from "./project.routers"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoute),
  app.use("/api/projects", projectRoute)
}
