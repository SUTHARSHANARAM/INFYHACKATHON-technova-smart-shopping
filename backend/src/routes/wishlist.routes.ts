import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { addToWishlistSchema } from '../schemas/wishlist.schema';

const router = Router();

router.use(requireAuth);

router.get('/', WishlistController.getWishlist);
router.post('/items', validate(addToWishlistSchema), WishlistController.addToWishlist);
router.delete('/items/:productId', WishlistController.removeFromWishlist);

export default router;
