import { apiClient } from './api';
import {
  User,
  Product,
  Category,
  Order,
  OrderStatus,
  DashboardMetrics,
  PaginatedResult,
  ApiResponse,
} from '../types';

export const adminService = {
  // Auth
  login: async (credentials: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', credentials);
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },

  // Dashboard
  getDashboard: async (): Promise<ApiResponse<DashboardMetrics>> => {
    return apiClient.get('/admin/dashboard');
  },

  // Products
  getProducts: async (params?: any): Promise<ApiResponse<PaginatedResult<Product>>> => {
    const q = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/products?${q}`);
  },
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get(`/products/${id}`);
  },
  createProduct: async (data: any): Promise<ApiResponse<Product>> => {
    return apiClient.post('/admin/products', data);
  },
  updateProduct: async (id: string, data: any): Promise<ApiResponse<Product>> => {
    return apiClient.patch(`/admin/products/${id}`, data);
  },
  deactivateProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.delete(`/admin/products/${id}`);
  },

  // Categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories');
  },
  createCategory: async (data: any): Promise<ApiResponse<Category>> => {
    return apiClient.post('/admin/categories', data);
  },
  updateCategory: async (id: string, data: any): Promise<ApiResponse<Category>> => {
    return apiClient.patch(`/admin/categories/${id}`, data);
  },
  deleteCategory: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete(`/admin/categories/${id}`);
  },

  // Orders
  getOrders: async (params?: any): Promise<ApiResponse<PaginatedResult<Order>>> => {
    const q = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/orders?${q}`);
  },
  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get(`/admin/orders/${id}`);
  },
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<ApiResponse<Order>> => {
    return apiClient.patch(`/admin/orders/${id}/status`, { status });
  },

  // Users
  getUsers: async (params?: any): Promise<ApiResponse<PaginatedResult<User>>> => {
    const q = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/users?${q}`);
  },
};
