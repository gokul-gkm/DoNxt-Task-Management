import { extractErrorMessage } from "../../utils/apiError.utils";
import { userAxiosInstance } from "../axios";

export interface ProjectData {
  _id?: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "Paused";
  progress: number;
  taskCount: number;
  dueDate: string;
  members: string[];
  color?: string;
  [key: string]: any;
}

export const projectService = {
  getProjects: async () => {
    try {
      const res = await userAxiosInstance.get("/projects");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  getProjectById: async (id: string) => {
    try {
      console.log("before api req", id);
      const res = await userAxiosInstance.get(`/projects/${id}`);
      console.log("res",res)
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  createProject: async (data: Partial<ProjectData>) => {
    try {
      const res = await userAxiosInstance.post("/projects", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  updateProject: async (id: string, data: Partial<ProjectData>) => {
    try {
      const res = await userAxiosInstance.patch(`/projects/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  deleteProject: async (id: string) => {
    try {
      const res = await userAxiosInstance.delete(`/projects/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getProjectStats: async (id: string) => {
    try {
      const res = await userAxiosInstance.get(`/projects/${id}/stats`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
};
