import { apiClient } from './api';
import { Wishlist, WishlistItem, ApiResponse } from '../types';

export const wishlistService = {
  getWishlist: async (): Promise<ApiResponse<Wishlist>> => {
    return apiClient.get('/wishlist');
  },
  addToWishlist: async (productId: string): Promise<ApiResponse<WishlistItem>> => {
    const res = await apiClient.post<ApiResponse<WishlistItem>>('/wishlist/items', { productId });
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
    return res;
  },
  removeFromWishlist: async (productId: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/wishlist/items/${productId}`);
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
    return res;
  },
};
