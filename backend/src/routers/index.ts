import { Express } from "express"
import authRoute from "./auth.routers"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoute)
}
