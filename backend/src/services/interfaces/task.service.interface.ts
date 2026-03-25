export interface ITaskService {
  createTask(userId: string, data: any): Promise<any>;
  getTasks(userId: string, query: any): Promise<any>;
  updateTask(userId: string, taskId: string, data: any): Promise<any>;
  deleteTask(userId: string, taskId: string): Promise<any>;
  getAnalytics(userId: string, days: number): Promise<any>;
}