import { extractErrorMessage } from "../../utils/apiError.utils";
import { userAxiosInstance } from "../axios";

export interface TaskData {
  _id?: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  projectId?: string;
  [key: string]: any;
}

export const taskService = {
  getTasks: async (options: { projectId?: string; search?: string; status?: string } = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.projectId) params.append("projectId", options.projectId);
      if (options.search) params.append("search", options.search);
      if (options.status) params.append("status", options.status);

      const url = `/tasks?${params.toString()}`;
      const res = await userAxiosInstance.get(url);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getAnalytics: async (days: number = 7) => {
    try {
      const res = await userAxiosInstance.get(`/tasks/analytics?days=${days}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  createTask: async (data: TaskData) => {
    try {
      const res = await userAxiosInstance.post("/tasks", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  updateTask: async (id: string, data: Partial<TaskData>) => {
    try {
      const res = await userAxiosInstance.patch(`/tasks/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      const res = await userAxiosInstance.delete(`/tasks/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
};
