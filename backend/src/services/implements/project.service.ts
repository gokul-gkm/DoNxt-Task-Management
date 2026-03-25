import { Inject, Service } from "typedi";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { IProjectService } from "../interfaces/project.service.interface";
import { IProjectRepository } from "@/repositories/interfaces/project.repository.interface";
import { AppError } from "@/utils/custom.error.utils";
import { responseMessage } from "@/enums/responseMessage";
import { ProjectStatsResponse } from "@/interfaces/project.interface";
import { ITaskRepository } from "@/repositories/interfaces/task.repository.interface";
import { ISocketService } from "../interfaces/socket.service.interface";

@Service()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(TOKENS.ProjectRepository)
    private _projectRepository: IProjectRepository,
    @Inject(TOKENS.TaskRepository)
    private _projectTaskRepository: ITaskRepository,
    @Inject(TOKENS.SocketService)
    private _socketService: ISocketService
  ) {}

  async createProject(userId: string, data: any) {
    try {
      if (!data.name) {
        throw new AppError("Project name is required", StatusCodes.BAD_REQUEST);
      }

      const project = await this._projectRepository.create({
        ...data,
        userId,
      });

      console.log(`[ProjectService] Project created: ${project._id}. Emitting to user:${userId}`);
      this._socketService.emitToUser(userId.toString(), "project:created", project);

      return {
        status: true,
        message: "Project created successfully",
        data: project,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Create Project Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProjects(userId: string) {
    try {
      const projects = await this._projectRepository.findAllWithStats(userId);

      return {
        status: true,
        message: "Projects fetched successfully",
        data: projects,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Get Projects Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProjectById(userId: string, projectId: string) {
    try {
      const project = await this._projectRepository.findById(projectId);

      if (!project || project.userId.toString() !== userId) {
        throw new AppError("Project not found", StatusCodes.BAD_REQUEST);
      }

      return {
        status: true,
        message: "Project fetched successfully",
        data: project,
      };
    } catch (error) {
      if (error instanceof AppError) {
        console.error("[ProjectService.getProjectById] AppError thrown:", error.message);
        throw error;
      }

      console.error("[ProjectService.getProjectById] Unexpected Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProject(userId: string, projectId: string, data: any) {
    try {
      const project = await this._projectRepository.findById(projectId);

      if (!project || project.userId.toString() !== userId) {
        throw new AppError("Project not found", StatusCodes.NOT_FOUND);
      }

      const updatedProject = await this._projectRepository.update(projectId, data);

      if (updatedProject) {
        console.log(`[ProjectService] Project updated: ${projectId}. Emitting to user:${userId}`);
        this._socketService.emitToUser(userId.toString(), "project:updated", updatedProject);
      }

      return {
        status: true,
        message: "Project updated successfully",
        data: updatedProject,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Update Project Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteProject(userId: string, projectId: string) {
    try {
      const project = await this._projectRepository.findById(projectId);

      if (!project || project.userId.toString() !== userId) {
        throw new AppError("Project not found", StatusCodes.NOT_FOUND);
      }

      await this._projectRepository.update(projectId, {
        is_archived: true,
      });

      console.log(`[ProjectService] Project deleted: ${projectId}. Emitting to user:${userId}`);
      this._socketService.emitToUser(userId.toString(), "project:deleted", { projectId });

      return {
        status: true,
        message: "Project deleted successfully",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.error("Delete Project Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  async getProjectStats(
  userId: string,
  projectId: string
): Promise<ProjectStatsResponse> {
  try {
    const project = await this._projectRepository.findById(projectId);

    if (!project || project.userId.toString() !== userId) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }

    const stats = await this._projectTaskRepository.getProjectStats(
      userId,
      projectId
    );

    const pending = stats.total - stats.completed;
    const progress =
      stats.total === 0
        ? 0
        : Math.round((stats.completed / stats.total) * 100);

    return {
      status: true,
      message: "Project stats fetched successfully",
      data: {
        total: stats.total,
        completed: stats.completed,
        pending,
        progress,
        isCompleted: stats.total > 0 && stats.completed === stats.total,
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    console.error("Project Stats Error:", error);

    throw new AppError(
      responseMessage.ERROR_MESSAGE,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
}