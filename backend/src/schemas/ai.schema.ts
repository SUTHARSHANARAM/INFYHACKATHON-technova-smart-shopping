import { z } from 'zod';

export const aiChatSchema = z.object({
  body: z.object({
    prompt: z.string().min(2, 'Prompt is required'),
    conversationHistory: z.array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    ).optional(),
  }),
});

export const aiRecommendSchema = z.object({
  body: z.object({
    query: z.string().min(2, 'Query is required'),
    maxPrice: z.number().positive().optional(),
    categorySlug: z.string().optional(),
    useCase: z.string().optional(),
  }),
});

export const aiCompareSchema = z.object({
  body: z.object({
    productIds: z.array(z.string().uuid()).min(2, 'Provide at least 2 product IDs to compare').max(4, 'Can compare at most 4 products'),
  }),
});

export const aiSearchSchema = z.object({
  body: z.object({
    naturalQuery: z.string().min(2, 'Query is required'),
  }),
});

export const aiInsightSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    question: z.string().optional(),
  }),
});
