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
    if (query.status && query.status !== "All") filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } }
      ];
    }

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

  async getUserAnalytics(userId: string, days: number): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchQuery = {
      userId: new Types.ObjectId(userId),
      is_archived: false,
      createdAt: { $gte: startDate }
    };

    const overview = await this.model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } },
          todo: { $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] } },
          overdue: { 
            $sum: { 
              $cond: [
                { 
                  $and: [
                    { $ne: ["$status", "done"] },
                    { $ne: ["$dueDate", null] },
                    { $lt: ["$dueDate", new Date()] }
                  ] 
                }, 
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);

    const chartData = await this.model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          added: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    
    const formattedChartData = dates.map(date => {
      const found = chartData.find(item => item._id === date);
      return {
        date,
        added: found ? found.added : 0,
        completed: found ? found.completed : 0
      };
    });

    const stats = overview.length ? overview[0] : { total: 0, completed: 0, inProgress: 0, todo: 0, overdue: 0 };
    delete stats._id;

    const projectStats = await this.model.aggregate([
      { $match: { userId: new Types.ObjectId(userId), is_archived: false } }, 
      {
        $group: {
          _id: "$projectId",
          tasks: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectInfo"
        }
      },
      { $unwind: "$projectInfo" },
      {
        $project: {
          id: "$_id",
          name: "$projectInfo.name",
          tasks: 1,
          progress: {
             $cond: [ { $eq: ["$tasks", 0] }, 0, { $round: [ { $multiply: [ { $divide: ["$completed", "$tasks"] }, 100 ] }, 0 ] } ]
          },
          status: {
            $cond: [ { $eq: ["$tasks", "$completed"] }, "Completed", "Active" ]
          }
        }
      },
      { $sort: { progress: -1 } }
    ]);

    return { overview: stats, chartData: formattedChartData, projectStats };
  }
}