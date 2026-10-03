import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { ApiResponse } from '../utils/apiResponse';

export class ReviewController {
  static async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId as string;
      const reviews = await ReviewService.getProductReviews(productId);
      return ApiResponse.success(res, reviews, 'Reviews fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = req.params.productId as string;
      const { rating, comment } = req.body;

      const review = await ReviewService.createReview(userId, productId, rating, comment);
      return ApiResponse.created(res, review, 'Review created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const { rating, comment } = req.body;

      const updated = await ReviewService.updateReview(userId, id, rating, comment);
      return ApiResponse.success(res, updated, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const result = await ReviewService.deleteReview(userId, id);
      return ApiResponse.success(res, result, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
