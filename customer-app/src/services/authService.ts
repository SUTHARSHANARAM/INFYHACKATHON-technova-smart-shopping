import { apiClient } from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  register: async (data: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/register', data);
  },
  login: async (credentials: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', credentials);
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },
};
