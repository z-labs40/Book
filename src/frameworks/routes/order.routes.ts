import { Router } from 'express';
import { getPurchases, getSales, getOrderDetails } from '../../adapters/controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/purchases', getPurchases);
router.get('/sales', getSales);
router.get('/:id', getOrderDetails);

export default router;
