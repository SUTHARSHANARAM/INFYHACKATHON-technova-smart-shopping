import { apiClient } from './api';
import { CartSummary, ApiResponse } from '../types';

export const cartService = {
  getCart: async (): Promise<ApiResponse<CartSummary>> => {
    return (await apiClient.get('/cart')) as unknown as ApiResponse<CartSummary>;
  },
  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse<CartSummary>> => {
    const res = (await apiClient.post('/cart/items', { productId, quantity })) as unknown as ApiResponse<CartSummary>;
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<CartSummary>> => {
    const res = (await apiClient.patch(`/cart/items/${productId}`, { quantity })) as unknown as ApiResponse<CartSummary>;
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  removeCartItem: async (productId: string): Promise<ApiResponse<CartSummary>> => {
    const res = (await apiClient.delete(`/cart/items/${productId}`)) as unknown as ApiResponse<CartSummary>;
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    const res = (await apiClient.delete('/cart')) as unknown as ApiResponse<{ message: string }>;
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
};
