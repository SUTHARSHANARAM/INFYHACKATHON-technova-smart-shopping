import { apiClient } from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories');
  },
  getCategoryById: async (idOrSlug: string): Promise<ApiResponse<Category>> => {
    return apiClient.get(`/categories/${idOrSlug}`);
  },
};
