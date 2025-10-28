import axiosInstance from './axios';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/register/', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/login/', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<{ data: User }>('/api/auth/current/');
    return response.data.data;
  },

  socialLogin: async (data: { provider: string; token?: string; code?: string }) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/social/', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
