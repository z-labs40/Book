import { Request, Response } from 'express';
import { GetBooksUseCase } from '../../application/use-cases/book/GetBooksUseCase';
import { CreateBookUseCase } from '../../application/use-cases/book/CreateBookUseCase';
import { GetBookByIdUseCase } from '../../application/use-cases/book/GetBookByIdUseCase';

export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new GetBooksUseCase();
    const books = await useCase.execute(req.query);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch books', details: error.message });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new GetBookByIdUseCase();
    const book = await useCase.execute(req.params.id as string);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch book details', details: error.message });
  }
};

export const createBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const sellerId = (req as any).user.userId;
    const useCase = new CreateBookUseCase();
    const newBook = await useCase.execute(sellerId, req.body);
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create book listing', details: error.message });
  }
};
