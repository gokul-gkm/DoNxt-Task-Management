import { PROJECT_ROUTES } from "../../constants/routes.constants";
import { extractErrorMessage } from "../../utils/apiError.utils";
import { userAxiosInstance } from "../axios";

export interface ProjectData {
  _id?: string;
  name: string;
  description: string;
  status: "Active" | "Completed";
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
      const res = await userAxiosInstance.get(PROJECT_ROUTES.BASE);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  getProjectById: async (id: string) => {
    try {
      console.log("before api req", id);
      const res = await userAxiosInstance.get(`${PROJECT_ROUTES.BASE}/${id}`);
      console.log("res",res)
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  createProject: async (data: Partial<ProjectData>) => {
    try {
      const res = await userAxiosInstance.post(PROJECT_ROUTES.BASE, data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  updateProject: async (id: string, data: Partial<ProjectData>) => {
    try {
      const res = await userAxiosInstance.patch(`${PROJECT_ROUTES.BASE}/${id}`, data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  
  deleteProject: async (id: string) => {
    try {
      const res = await userAxiosInstance.delete(`${PROJECT_ROUTES.BASE}/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getProjectStats: async (id: string) => {
    try {
      const res = await userAxiosInstance.get(`${PROJECT_ROUTES.BASE}/${id}/${PROJECT_ROUTES.STATS}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
};
