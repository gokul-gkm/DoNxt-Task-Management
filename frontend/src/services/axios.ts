import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

userAxiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
