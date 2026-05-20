import { Router } from 'express';
import { getBooks, createBook, getBookById } from '../../adapters/controllers/book.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', authenticateToken, createBook);

export default router;
