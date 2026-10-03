import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReviewSchema, updateReviewSchema } from '../schemas/review.schema';

const router = Router();

router.get('/products/:productId/reviews', ReviewController.getProductReviews);
router.post('/products/:productId/reviews', requireAuth, validate(createReviewSchema), ReviewController.createReview);
router.patch('/reviews/:id', requireAuth, validate(updateReviewSchema), ReviewController.updateReview);
router.delete('/reviews/:id', requireAuth, ReviewController.deleteReview);

export default router;
