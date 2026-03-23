import { Inject, Service } from "typedi";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { IProjectService } from "../interfaces/project.service.interface";
import { IProjectRepository } from "@/repositories/interfaces/project.repository.interface";
import { AppError } from "@/utils/custom.error.utils";
import { responseMessage } from "@/enums/responseMessage";

@Service()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(TOKENS.ProjectRepository)
    private _projectRepository: IProjectRepository
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
      const projects = await this._projectRepository.findAll({
        userId,
        is_archived: false,
      });

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

  async updateProject(userId: string, projectId: string, data: any) {
    try {
      const project = await this._projectRepository.findById(projectId);

      if (!project || project.userId.toString() !== userId) {
        throw new AppError("Project not found", StatusCodes.NOT_FOUND);
      }

      const updatedProject = await this._projectRepository.update(projectId, data);

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
}