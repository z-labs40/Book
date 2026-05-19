import { Request, Response } from 'express';
import { StudentOrdersUseCase } from '../../application/use-cases/order/StudentOrdersUseCase';
import { logger } from '../../shared/loggers';

export const getPurchases = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new StudentOrdersUseCase();
    const purchases = await useCase.getPurchases(userId);
    res.json(purchases);
  } catch (error: any) {
    logger.error(`Failed to get purchases for student ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch purchase history' });
  }
};

export const getSales = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new StudentOrdersUseCase();
    const sales = await useCase.getSales(userId);
    res.json(sales);
  } catch (error: any) {
    logger.error(`Failed to get sales for student ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
};

export const getOrderDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new StudentOrdersUseCase();
    const order = await useCase.getOrderDetails(userId, req.params.id as string);
    res.json(order);
  } catch (error: any) {
    logger.error(`Failed to get order details: ${error.message}`);
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(404).json({ error: error.message });
  }
};
