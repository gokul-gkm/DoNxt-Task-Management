import Container, { Inject, Service } from "typedi";
import {  Response } from "express";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { IProjectController } from "../interfaces/project.controller.interface";
import { IProjectService } from "@/services/interfaces/project.service.interface";
import { AuthRequest } from "@/interfaces/api.interface";
import { AppError } from "@/utils/custom.error.utils";

@Service()
export class ProjectController implements IProjectController {
  constructor(
    @Inject(TOKENS.ProjectService)
    private _projectService: IProjectService
  ) {}

  createProject = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const result = await this._projectService.createProject(
      userId,
      req.body
    );

    return res.status(StatusCodes.CREATED).json(result);
  };

  getProjects = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._projectService.getProjects(userId);

    return res.status(StatusCodes.OK).json(result);
  };

  updateProject = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const projectId = req.params.id as string;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._projectService.updateProject(
      userId,
      projectId,
      req.body
    );

    return res.status(StatusCodes.OK).json(result);
  };

  deleteProject = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const projectId = req.params.id as string;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._projectService.deleteProject(
      userId,
      projectId
    );

    return res.status(StatusCodes.OK).json(result);
  };
}

export const projectController = Container.get(ProjectController);