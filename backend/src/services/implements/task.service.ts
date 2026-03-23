import { Inject, Service } from "typedi";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { ITaskService } from "../interfaces/task.service.interface";
import { ITaskRepository } from "@/repositories/interfaces/task.repository.interface";
import { IProjectRepository } from "@/repositories/interfaces/project.repository.interface";

import { AppError } from "@/utils/custom.error.utils";
import { responseMessage } from "@/enums/responseMessage";

@Service()
export class TaskService implements ITaskService {
  constructor(
    @Inject(TOKENS.TaskRepository)
    private _taskRepository: ITaskRepository,

    @Inject(TOKENS.ProjectRepository)
    private _projectRepository: IProjectRepository
  ) {}

  async createTask(userId: string, data: any) {
    try {
      if (!data.title || !data.projectId) {
        throw new AppError(
          "Title and Project are required",
          StatusCodes.BAD_REQUEST
        );
      }

      const project = await this._projectRepository.findById(data.projectId);

      if (!project || project.userId.toString() !== userId) {
        throw new AppError("Invalid project", StatusCodes.BAD_REQUEST);
      }

      const task = await this._taskRepository.create({
        ...data,
        userId,
      });

      return {
        status: true,
        message: "Task created successfully",
        data: task,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Create Task Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTasks(userId: string, query: any) {
    try {
      const tasks = await this._taskRepository.findTasks(userId, query);

      return {
        status: true,
        message: "Tasks fetched successfully",
        data: tasks,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Get Tasks Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateTask(userId: string, taskId: string, data: any) {
    try {
      const task = await this._taskRepository.findById(taskId);

      if (!task || task.userId.toString() !== userId) {
        throw new AppError("Task not found", StatusCodes.NOT_FOUND);
      }

      const updated = await this._taskRepository.update(taskId, data);

      return {
        status: true,
        message: "Task updated successfully",
        data: updated,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Update Task Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteTask(userId: string, taskId: string) {
    try {
      const task = await this._taskRepository.findById(taskId);

      if (!task || task.userId.toString() !== userId) {
        throw new AppError("Task not found", StatusCodes.NOT_FOUND);
      }

      await this._taskRepository.update(taskId, {
        is_archived: true,
      });

      return {
        status: true,
        message: "Task deleted successfully",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Delete Task Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}