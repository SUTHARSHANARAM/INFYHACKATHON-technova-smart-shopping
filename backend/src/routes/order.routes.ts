import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderSchema } from '../schemas/order.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createOrderSchema), OrderController.createOrder);
router.get('/', OrderController.getCustomerOrders);
router.get('/:id', OrderController.getCustomerOrderById);

export default router;
