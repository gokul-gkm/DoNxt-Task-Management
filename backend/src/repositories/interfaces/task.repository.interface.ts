import { TaskQuery } from "@/interfaces/task.interface";
import { ITask } from "@/models/task.model";
import { IBaseRepository } from "./base.repository.interface";
import { ProjectStats } from "@/interfaces/project.interface";

export interface ITaskRepository extends IBaseRepository<ITask> {
  findTasks(userId: string, query: TaskQuery): Promise<ITask[]>;
  getProjectStats(userId: string, projectId: string): Promise<ProjectStats>;
  getUserAnalytics(userId: string, days: number): Promise<any>;
}

