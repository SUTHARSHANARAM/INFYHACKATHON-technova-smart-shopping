import { apiClient } from './api';
import { Order, ApiResponse } from '../types';

export const orderService = {
  createOrder: async (addressId: string): Promise<ApiResponse<Order>> => {
    return apiClient.post('/orders', { addressId });
  },
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get('/orders');
  },
  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get(`/orders/${id}`);
  },
};
