import { AppDataSource } from '../../../infrastructure/database';
import { Book } from '../../../adapters/models/Book';

export class GetBookByIdUseCase {
  async execute(id: string) {
    const bookRepository = AppDataSource.getRepository(Book);
    const book = await bookRepository.findOne({
      where: { id },
      relations: ["seller"]
    });

    if (!book) return null;

    // Increment views count dynamically
    book.viewsCount = (book.viewsCount || 0) + 1;
    await bookRepository.save(book);

    return {
      ...book,
      seller: book.seller ? {
        id: book.seller.id,
        name: book.seller.name,
        avatarUrl: book.seller.avatarUrl,
      } : null
    };
  }
}
