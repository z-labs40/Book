import { Request, Response } from 'express';
import { CartUseCase } from '../../application/use-cases/cart/CartUseCase';
import { logger } from '../../shared/loggers';

export const getCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new CartUseCase();
    const cart = await useCase.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    logger.error(`Failed to get cart for user: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const { bookId, quantity } = req.body;
    const useCase = new CartUseCase();
    const cartItem = await useCase.addToCart(userId, bookId, quantity || 1);
    res.status(201).json(cartItem);
  } catch (error: any) {
    logger.error(`Failed to add to cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new CartUseCase();
    const result = await useCase.removeFromCart(userId, req.params.id as string);
    res.json(result);
  } catch (error: any) {
    logger.error(`Failed to remove from cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const checkout = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new CartUseCase();
    const result = await useCase.checkout(userId);
    res.json(result);
  } catch (error: any) {
    logger.error(`Checkout failed for user ${(req as any).user?.userId}: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
