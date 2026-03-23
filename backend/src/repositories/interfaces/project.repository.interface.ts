import { IBaseRepository } from "./base.repository.interface";
import { IProject } from "@/models/project.model";

export interface IProjectRepository extends IBaseRepository<IProject>{
    findByUser(userId: string): Promise<IProject[]>
}