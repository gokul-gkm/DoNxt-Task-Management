import { Service } from "typedi";
import { BaseRepository } from "./base.repository";
import { Task, ITask } from "@/models/task.model";
import { ITaskRepository} from "../interfaces/task.repository.interface";
import { TaskQuery } from "@/interfaces/task.interface";
import { Types } from "mongoose";
import { ProjectStats } from "@/interfaces/project.interface";

@Service()
export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository {

  constructor() {
    super(Task);
  }

  async findTasks(userId: string, query: TaskQuery): Promise<ITask[]> {
    const filter: Record<string, any> = {
      userId,
      is_archived: false,
    };

    if (query.projectId) filter.projectId = query.projectId;
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    return this.findAll(filter, { sort: { createdAt: -1 } });
  }
  
   async getProjectStats(userId: string, projectId: string): Promise<ProjectStats> {
    const result = await this.model.aggregate([
        {
        $match: {
            userId: new Types.ObjectId(userId),
            projectId: new Types.ObjectId(projectId),
            is_archived: false,
        },
        },
        {
        $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
            $sum: {
                $cond: [{ $eq: ["$status", "done"] }, 1, 0],
            },
            },
        },
        },
    ]);

    if (!result.length) {
        return { total: 0, completed: 0 };
    }

    return {
        total: result[0].total,
        completed: result[0].completed,
    };
  }
}