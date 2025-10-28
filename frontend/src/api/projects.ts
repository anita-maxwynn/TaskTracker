import axiosInstance from './axios';
import type { Project } from '../types';

export const projectApi = {
  getAll: async (workspaceId?: number) => {
    const response = await axiosInstance.get<Project[]>('/api/projects/', {
      params: workspaceId ? { workspace: workspaceId } : undefined,
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Project>(`/api/projects/${id}/`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; image_url?: string; workspace: number }) => {
    const response = await axiosInstance.post<Project>('/api/projects/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Project>) => {
    const response = await axiosInstance.patch<Project>(`/api/projects/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/api/projects/${id}/`);
  },
};
