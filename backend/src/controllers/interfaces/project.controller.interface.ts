import { AuthRequest } from "@/interfaces/api.interface";
import { Response } from "express";

export interface IProjectController {
  createProject(req: AuthRequest, res: Response): Promise<Response>;
  getProjects(req: AuthRequest, res: Response): Promise<Response>;
  updateProject(req: AuthRequest, res: Response): Promise<Response>;
  deleteProject(req: AuthRequest, res: Response): Promise<Response>;
  getProjectStats(req: AuthRequest, res: Response): Promise<Response>
}