import { apiClient } from './api';
import { Wishlist, WishlistItem, ApiResponse } from '../types';

export const wishlistService = {
  getWishlist: async (): Promise<ApiResponse<Wishlist>> => {
    return (await apiClient.get('/wishlist')) as unknown as ApiResponse<Wishlist>;
  },
  addToWishlist: async (productId: string): Promise<ApiResponse<WishlistItem>> => {
    const res = (await apiClient.post('/wishlist/items', { productId })) as unknown as ApiResponse<WishlistItem>;
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
    return res;
  },
  removeFromWishlist: async (productId: string): Promise<ApiResponse<{ message: string }>> => {
    const res = (await apiClient.delete(`/wishlist/items/${productId}`)) as unknown as ApiResponse<{ message: string }>;
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
    return res;
  },
};
