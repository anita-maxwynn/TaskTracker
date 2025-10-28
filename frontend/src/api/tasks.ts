import axiosInstance from './axios';
import type { Task } from '../types';

export const taskApi = {
  getAll: async (projectId?: number) => {
    const response = await axiosInstance.get<Task[]>('/api/tasks/', {
      params: projectId ? { project: projectId } : undefined,
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Task>(`/api/tasks/${id}/`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    status?: string;
    project: number;
    assigned_to?: number;
    due_date?: string;
  }) => {
    const response = await axiosInstance.post<Task>('/api/tasks/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Task>) => {
    const response = await axiosInstance.patch<Task>(`/api/tasks/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/api/tasks/${id}/`);
  },

  bulkUpdate: async (updates: Array<{ id: number; position: number; status?: string }>) => {
    const response = await axiosInstance.post('/api/tasks/bulk-update/', { updates });
    return response.data;
  },
};
