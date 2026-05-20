import { AppDataSource } from '../../../infrastructure/database';
import { Book } from '../../../adapters/models/Book';

export class GetBookByIdUseCase {
  async execute(id: string) {
    const bookRepository = AppDataSource.getRepository(Book);
    const isValidUuid = id && id.includes("-") && id.length === 36;
    let book = null;
    if (isValidUuid) {
      book = await bookRepository.findOne({
        where: { id },
        relations: ["seller"]
      });
    } else {
      const books = await bookRepository.find({ relations: ["seller"] });
      const toSlug = (title: string) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      book = books.find(b => toSlug(b.title) === id) || null;
    }

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
