import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema';

const router = Router();

router.use(requireAuth);

router.get('/', AddressController.getAddresses);
router.post('/', validate(createAddressSchema), AddressController.createAddress);
router.patch('/:id', validate(updateAddressSchema), AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);

export default router;
