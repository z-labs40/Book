import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../../adapters/controllers/wishlist.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getWishlist);
router.post('/:bookId', toggleWishlist);

export default router;
