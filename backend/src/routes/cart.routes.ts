import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../schemas/cart.schema';

const router = Router();

router.use(requireAuth);

router.get('/', CartController.getCart);
router.post('/items', validate(addToCartSchema), CartController.addToCart);
router.patch('/items/:productId', validate(updateCartItemSchema), CartController.updateCartItem);
router.delete('/items/:productId', CartController.removeCartItem);
router.delete('/', CartController.clearCart);

export default router;
