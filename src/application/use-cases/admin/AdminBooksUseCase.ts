import { AppDataSource } from '../../../infrastructure/database';
import { Book, Status } from '../../../adapters/models/Book';
import { logger } from '../../../shared/loggers';

export class AdminBooksUseCase {
  async getBooks(query: any) {
    const bookRepo = AppDataSource.getRepository(Book);
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const status = query.status as Status;

    const whereClause: any = {};
    if (status && Object.values(Status).includes(status)) {
      whereClause.status = status;
    }

    const [books, total] = await bookRepo.findAndCount({
      where: whereClause,
      relations: ['seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      books: books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        department: b.department,
        semester: b.semester,
        price: b.price,
        condition: b.condition,
        status: b.status,
        createdAt: b.createdAt,
        seller: b.seller ? {
          id: b.seller.id,
          name: b.seller.name,
          email: b.seller.email,
          avatarUrl: b.seller.avatarUrl,
          rating: parseFloat((b.seller.rating as any) || 5.0)
        } : null
      })),
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async approveBook(id: string) {
    const bookRepo = AppDataSource.getRepository(Book);
    const book = await bookRepo.findOneBy({ id });
    if (!book) throw new Error("Book not found");

    if (book.status === Status.ACTIVE) {
      return book;
    }

    book.status = Status.ACTIVE;
    book.available = true;
    await bookRepo.save(book);

    logger.info(`Admin approved book listing: ${id}`);
    return book;
  }

  async deleteBook(id: string) {
    const bookRepo = AppDataSource.getRepository(Book);
    const book = await bookRepo.findOneBy({ id });
    if (!book) throw new Error("Book not found");

    book.status = Status.REJECTED;
    book.available = false;
    await bookRepo.save(book);

    logger.info(`Admin soft-deleted / rejected book listing: ${id}`);
    return { message: "Book listing archived successfully" };
  }
}
