import { Request, Response } from 'express';
import { WishlistUseCase } from '../../application/use-cases/wishlist/WishlistUseCase';
import { logger } from '../../shared/loggers';

export const getWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const useCase = new WishlistUseCase();
    const wishlist = await useCase.getWishlist(userId);
    res.json(wishlist);
  } catch (error: any) {
    logger.error(`Failed to get wishlist: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch wishlist items' });
  }
};

export const toggleWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const bookId = req.params.bookId as string;
    const useCase = new WishlistUseCase();
    const result = await useCase.toggleWishlist(userId, bookId);
    res.json(result);
  } catch (error: any) {
    logger.error(`Failed to toggle wishlist: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
