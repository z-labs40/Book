import { Router } from 'express';
import { getCart, addToCart, removeFromCart, checkout } from '../../adapters/controllers/cart.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeFromCart);
router.post('/checkout', checkout);

export default router;
