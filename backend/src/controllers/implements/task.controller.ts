import Container, { Inject, Service } from "typedi";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { ITaskService } from "@/services/interfaces/task.service.interface";
import { AppError } from "@/utils/custom.error.utils";
import { AuthRequest } from "@/interfaces/api.interface";
import { ITaskController } from "../interfaces/task.controller.interface";

@Service()
export class TaskController implements ITaskController {
  constructor(
    @Inject(TOKENS.TaskService) 
    private _taskService: ITaskService
  ) {}

  createTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    console.log(`[TaskController] createTask triggered by userId: ${userId}`);
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._taskService.createTask(
      userId,
      req.body
    );

    return res.status(StatusCodes.CREATED).json(result);
  };

  getTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._taskService.getTasks(
      userId,
      req.query
    );

    return res.status(StatusCodes.OK).json(result);
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const taskId = req.params.id as string;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._taskService.updateTask(
      userId,
      taskId,
      req.body
    );

    return res.status(StatusCodes.OK).json(result);
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const taskId = req.params.id as string;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const result = await this._taskService.deleteTask(
      userId,
      taskId
    );

    return res.status(StatusCodes.OK).json(result);
  };

  getAnalytics = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const days = parseInt(req.query.days as string) || 7;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    
    const result = await this._taskService.getAnalytics(userId, days);

    return res.status(StatusCodes.OK).json(result);
  };
}

export const taskController = Container.get(TaskController);