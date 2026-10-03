import { apiClient } from './api';
import { ApiResponse, Product } from '../types';

export interface AIChatResponse {
  response: string;
  products?: Product[];
  groundedDataUsed?: boolean;
}

export interface AIRecommendResponse {
  matchedProducts: any[];
  explanation: string;
}

export interface AICompareResponse {
  products: any[];
  specKeys: string[];
  comparisonMatrix: Record<string, Record<string, string>>;
  verdict: string;
}

export interface AISearchResponse {
  query: string;
  parsedFilters: {
    detectedMaxPrice: number | null;
    detectedKeywords: string[];
    detectedRam: string | null;
  };
  resultCount: number;
  products: Product[];
}

export interface AIInsightResponse {
  product: any;
  keyHighlights: string[];
  reviewSentiment: string;
  aiSummary: string;
}

export const aiService = {
  chat: async (prompt: string, conversationHistory?: any[]): Promise<ApiResponse<AIChatResponse>> => {
    return apiClient.post('/ai/chat', { prompt, conversationHistory });
  },

  recommend: async (query: string, maxPrice?: number, categorySlug?: string, useCase?: string): Promise<ApiResponse<AIRecommendResponse>> => {
    return apiClient.post('/ai/recommend', { query, maxPrice, categorySlug, useCase });
  },

  compare: async (productIds: string[]): Promise<ApiResponse<AICompareResponse>> => {
    return apiClient.post('/ai/compare', { productIds });
  },

  search: async (naturalQuery: string): Promise<ApiResponse<AISearchResponse>> => {
    return apiClient.post('/ai/search', { naturalQuery });
  },

  insight: async (productId: string, question?: string): Promise<ApiResponse<AIInsightResponse>> => {
    return apiClient.post('/ai/insight', { productId, question });
  },
};
