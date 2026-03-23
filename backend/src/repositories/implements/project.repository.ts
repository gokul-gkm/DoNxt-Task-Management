import { Service } from "typedi";
import { IProject, Project } from "@/models/project.model";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interfaces/project.repository.interface";

@Service()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
  constructor() {
    super(Project);
  }

  async findByUser(userId: string):Promise<IProject[]>  {
    return this.findAll({ userId, isArchived: false });
  }
}