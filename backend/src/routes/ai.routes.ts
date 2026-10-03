import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { validate } from '../middleware/validate.middleware';
import {
  aiChatSchema,
  aiRecommendSchema,
  aiCompareSchema,
  aiSearchSchema,
  aiInsightSchema,
} from '../schemas/ai.schema';

const router = Router();

router.post('/chat', validate(aiChatSchema), AiController.chat);
router.post('/recommend', validate(aiRecommendSchema), AiController.recommend);
router.post('/compare', validate(aiCompareSchema), AiController.compare);
router.post('/search', validate(aiSearchSchema), AiController.search);
router.post('/insight', validate(aiInsightSchema), AiController.insight);

export default router;
