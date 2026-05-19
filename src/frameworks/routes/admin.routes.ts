import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import {
  adminLogin,
  adminLogout,
  getAnalyticsOverview,
  getBooks,
  approveBook,
  deleteBook,
  getOrders,
  updateOrderStatus
} from '../../adapters/controllers/admin.controller';

const router = Router();

// Public Admin Auth Routes
router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminLogout);

// All routes below require valid token + admin role
router.use(authenticateToken, requireAdmin);

// Analytics & KPI Overview
router.get('/analytics/overview', getAnalyticsOverview);

// Tab 1: Book Listings Management
router.get('/books', getBooks);
router.patch('/books/:id/approve', approveBook);
router.delete('/books/:id', deleteBook);

// Tab 2: Customer Orders Management
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
