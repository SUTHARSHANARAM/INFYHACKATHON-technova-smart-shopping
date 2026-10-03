import { apiClient } from './api';
import { Product, PaginatedResult, ProductFilters, ApiResponse } from '../types';

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<PaginatedResult<Product>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(key, String(val));
        }
      });
    }
    return apiClient.get(`/products?${params.toString()}`);
  },

  getProductById: async (idOrSlug: string): Promise<ApiResponse<Product>> => {
    return apiClient.get(`/products/${idOrSlug}`);
  },

  getFeaturedProducts: async (limit: number = 8): Promise<ApiResponse<Product[]>> => {
    return apiClient.get(`/products/featured?limit=${limit}`);
  },

  searchProducts: async (query: string): Promise<ApiResponse<PaginatedResult<Product>>> => {
    return apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
  },

  getBrands: async (): Promise<ApiResponse<{ brand: string; count: number }[]>> => {
    return apiClient.get('/products/brands');
  },
};
