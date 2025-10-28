import axiosInstance from './axios';
import type { Workspace, WorkspaceMember } from '../types';

export const workspaceApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Workspace[]>('/api/workspaces/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Workspace>(`/api/workspaces/${id}/`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; image_url?: string }) => {
    const response = await axiosInstance.post<Workspace>('/api/workspaces/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Workspace>) => {
    const response = await axiosInstance.patch<Workspace>(`/api/workspaces/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/api/workspaces/${id}/`);
  },

  join: async (inviteLink: string) => {
    const response = await axiosInstance.post('/api/workspaces/join/', { invite_link: inviteLink });
    return response.data;
  },

  regenerateInvite: async (id: number) => {
    const response = await axiosInstance.post(`/api/workspaces/${id}/regenerate-invite/`);
    return response.data;
  },

  getMembers: async (workspaceId: number) => {
    const response = await axiosInstance.get<WorkspaceMember[]>('/api/members/', {
      params: { workspace: workspaceId },
    });
    return response.data;
  },

  updateMember: async (memberId: number, role: 'admin' | 'member') => {
    const response = await axiosInstance.patch<WorkspaceMember>(`/api/members/${memberId}/`, { role });
    return response.data;
  },

  removeMember: async (memberId: number) => {
    await axiosInstance.delete(`/api/members/${memberId}/`);
  },
};
