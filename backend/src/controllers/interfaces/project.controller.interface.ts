import { Request, Response } from "express";

export interface IProjectController {
  createProject(req: Request, res: Response): Promise<Response>;
  getProjects(req: Request, res: Response): Promise<Response>;
  updateProject(req: Request, res: Response): Promise<Response>;
  deleteProject(req: Request, res: Response): Promise<Response>;
}