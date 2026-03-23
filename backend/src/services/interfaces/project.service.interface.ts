import { AuthResponse } from "@/interfaces/auth.interface";

export interface IProjectService {
  createProject(userId: string, data: any): Promise<AuthResponse>;
  getProjects(userId: string): Promise<AuthResponse>;
  updateProject(userId: string, projectId: string, data: any): Promise<AuthResponse>;
  deleteProject(userId: string, projectId: string): Promise<AuthResponse>;
}