import { apiClient } from './api';
import { Address, ApiResponse } from '../types';

export const addressService = {
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    return apiClient.get('/addresses');
  },
  createAddress: async (data: any): Promise<ApiResponse<Address>> => {
    return apiClient.post('/addresses', data);
  },
  updateAddress: async (id: string, data: any): Promise<ApiResponse<Address>> => {
    return apiClient.patch(`/addresses/${id}`, data);
  },
  deleteAddress: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete(`/addresses/${id}`);
  },
};
