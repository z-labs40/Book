import { Request, Response } from 'express';
import { GetBooksUseCase } from '../../application/use-cases/book/GetBooksUseCase';
import { CreateBookUseCase } from '../../application/use-cases/book/CreateBookUseCase';

export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new GetBooksUseCase();
    const books = await useCase.execute(req.query);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch books', details: error.message });
  }
};

export const createBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const sellerId = (req as any).user.userId;
    const useCase = new CreateBookUseCase();
    const newBook = await useCase.execute(sellerId, req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book listing' });
  }
};
