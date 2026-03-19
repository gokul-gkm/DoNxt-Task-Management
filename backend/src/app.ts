import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/cors.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import { registerRoutes } from "./routers";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
registerRoutes(app);

export default app;