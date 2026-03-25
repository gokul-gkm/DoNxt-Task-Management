import { Service } from "typedi";
import { IProject, Project } from "@/models/project.model";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interfaces/project.repository.interface";
import { Types } from "mongoose";

@Service()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
  constructor() {
    super(Project);
  }

  async findByUser(userId: string): Promise<IProject[]> {
    return this.findAll({ userId, is_archived: false });
  }

  async findAllWithStats(userId: string): Promise<any[]> {
    return this.model.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          is_archived: false
        }
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "projectId",
          as: "projectTasks"
        }
      },
      {
        $addFields: {
          activeTasks: {
            $filter: {
              input: "$projectTasks",
              as: "task",
              cond: { $eq: ["$$task.is_archived", false] }
            }
          }
        }
      },
      {
        $addFields: {
          taskCount: { $size: "$activeTasks" },
          completedTasks: {
            $size: {
              $filter: {
                input: "$activeTasks",
                as: "task",
                cond: { $eq: ["$$task.status", "done"] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          progress: {
            $cond: [
              { $eq: ["$taskCount", 0] },
              0,
              { $round: [ { $multiply: [ { $divide: ["$completedTasks", "$taskCount"] }, 100 ] }, 0 ] }
            ]
          },
          status: {
            $cond: [
              { $and: [{ $gt: ["$taskCount", 0] }, { $eq: ["$taskCount", "$completedTasks"] }] },
              "Completed",
              "Active"
            ]
          }
        }
      },
      {
        $project: {
          projectTasks: 0,
          activeTasks: 0,
          completedTasks: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
  }
}