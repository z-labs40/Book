import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUserUseCase';
import { AdminAnalyticsUseCase } from '../../application/use-cases/admin/AdminAnalyticsUseCase';
import { AdminBooksUseCase } from '../../application/use-cases/admin/AdminBooksUseCase';
import { AdminOrdersUseCase } from '../../application/use-cases/admin/AdminOrdersUseCase';
import { OrderStatus } from '../models/Order';
import { logger } from '../../shared/loggers';

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const useCase = new LoginUserUseCase();
    const result = await useCase.execute({ email, password, isAdminLogin: true });
    
    // Set secure HTTP-only cookie
    res.cookie('admin_token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    res.json(result);
  } catch (error: any) {
    logger.error(`Admin login failed for ${req.body?.email}: ${error.message}`);
    if (error.message === 'Invalid credentials' || error.message.includes('Access denied')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminLogout = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie('admin_token');
  logger.info('Admin logged out successfully');
  res.json({ message: 'Logged out successfully' });
};

export const getAnalyticsOverview = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new AdminAnalyticsUseCase();
    const overview = await useCase.getOverview();
    res.json(overview);
  } catch (error: any) {
    logger.error(`Failed to get analytics overview: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
};

export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new AdminBooksUseCase();
    const result = await useCase.getBooks(req.query);
    res.json(result);
  } catch (error: any) {
    logger.error(`Admin failed to get books: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const approveBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new AdminBooksUseCase();
    const book = await useCase.approveBook(req.params.id as string);
    res.json({ message: 'Book listing approved successfully', book });
  } catch (error: any) {
    logger.error(`Admin failed to approve book ${req.params.id}: ${error.message}`);
    if (error.message.includes('not found') || error.message.includes('state')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to approve book listing' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new AdminBooksUseCase();
    const result = await useCase.deleteBook(req.params.id as string);
    res.json(result);
  } catch (error: any) {
    logger.error(`Admin failed to delete book ${req.params.id}: ${error.message}`);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete book listing' });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new AdminOrdersUseCase();
    const result = await useCase.getOrders(req.query);
    res.json(result);
  } catch (error: any) {
    logger.error(`Admin failed to get orders: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status } = req.body;
    const useCase = new AdminOrdersUseCase();
    const order = await useCase.updateOrderStatus(req.params.id as string, status as OrderStatus);
    res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    logger.error(`Admin failed to update order ${req.params.id}: ${error.message}`);
    if (error.message.includes('not found') || error.message.includes('Invalid status')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
