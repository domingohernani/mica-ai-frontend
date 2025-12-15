import { useStore } from "@/stores/use-store";
import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"],
  timeout: 30000,
});

// Use the token stored using the zustand
api.interceptors.request.use(
  async (config) => {
    const token = useStore.getState().token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
