import { AuthRequest } from "@/interfaces/api.interface";
import { Response } from "express";

export interface ITaskController {
  createTask(req: AuthRequest, res: Response): Promise<Response>;
  getTasks(req: AuthRequest, res: Response): Promise<Response>;
  updateTask(req: AuthRequest, res: Response): Promise<Response>;
  deleteTask(req: AuthRequest, res: Response): Promise<Response>;
}