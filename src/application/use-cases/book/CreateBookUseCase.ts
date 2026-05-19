import { AppDataSource } from '../../../infrastructure/database';
import { Book } from '../../../adapters/models/Book';
import { logger } from '../../../shared/loggers';

export class CreateBookUseCase {
  async execute(sellerId: string, bookData: any): Promise<Book> {
    const bookRepository = AppDataSource.getRepository(Book);
    
    bookData.seller = { id: sellerId };
    
    // Explicitly casting bookData to prevent TypeORM from inferring an array type
    const newBook = bookRepository.create(bookData as Partial<Book>);
    await bookRepository.save(newBook);
    
    logger.info(`Book created: ${newBook.id} by seller: ${sellerId}`);
    return newBook;
  }
}
