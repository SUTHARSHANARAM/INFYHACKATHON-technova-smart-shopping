import { apiClient } from './api';
import { CartSummary, ApiResponse } from '../types';

export const cartService = {
  getCart: async (): Promise<ApiResponse<CartSummary>> => {
    return apiClient.get('/cart');
  },
  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse<CartSummary>> => {
    const res = await apiClient.post<ApiResponse<CartSummary>>('/cart/items', { productId, quantity });
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<CartSummary>> => {
    const res = await apiClient.patch<ApiResponse<CartSummary>>(`/cart/items/${productId}`, { quantity });
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  removeCartItem: async (productId: string): Promise<ApiResponse<CartSummary>> => {
    const res = await apiClient.delete<ApiResponse<CartSummary>>(`/cart/items/${productId}`);
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>('/cart');
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return res;
  },
};
