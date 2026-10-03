import { Request, Response, NextFunction } from 'express';
import { AiService } from '../services/ai/ai.service';
import { AiRecommendationService } from '../services/ai/recommendation.service';
import { AiComparisonService } from '../services/ai/comparison.service';
import { AiSearchService } from '../services/ai/search.service';
import { AiInsightService } from '../services/ai/insight.service';
import { ApiResponse } from '../utils/apiResponse';

export class AiController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, conversationHistory } = req.body;
      const result = await AiService.chat(prompt, conversationHistory);
      return ApiResponse.success(res, result, 'AI response generated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async recommend(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, maxPrice, categorySlug, useCase } = req.body;
      const result = await AiRecommendationService.getRecommendations(query, maxPrice, categorySlug, useCase);
      return ApiResponse.success(res, result, 'AI product recommendations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async compare(req: Request, res: Response, next: NextFunction) {
    try {
      const { productIds } = req.body;
      const result = await AiComparisonService.compareProducts(productIds);
      return ApiResponse.success(res, result, 'AI product comparison generated');
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { naturalQuery } = req.body;
      const result = await AiSearchService.smartSearch(naturalQuery);
      return ApiResponse.success(res, result, 'AI smart search results generated');
    } catch (error) {
      next(error);
    }
  }

  static async insight(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, question } = req.body;
      const result = await AiInsightService.getProductInsight(productId, question);
      return ApiResponse.success(res, result, 'AI product insights retrieved');
    } catch (error) {
      next(error);
    }
  }
}
