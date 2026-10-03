import { apiClient } from './api';
import { Review, ApiResponse } from '../types';

export const reviewService = {
  getProductReviews: async (productId: string): Promise<ApiResponse<Review[]>> => {
    return apiClient.get(`/products/${productId}/reviews`);
  },
  createReview: async (productId: string, rating: number, comment: string): Promise<ApiResponse<Review>> => {
    return apiClient.post(`/products/${productId}/reviews`, { rating, comment });
  },
  updateReview: async (reviewId: string, rating?: number, comment?: string): Promise<ApiResponse<Review>> => {
    return apiClient.patch(`/reviews/${reviewId}`, { rating, comment });
  },
  deleteReview: async (reviewId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete(`/reviews/${reviewId}`);
  },
};
