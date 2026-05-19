import { AppDataSource } from '../../../infrastructure/database';
import { Book, Status, Condition } from '../../../adapters/models/Book';

export class GetBooksUseCase {
  async execute(query: any) {
    const bookRepository = AppDataSource.getRepository(Book);
    const { department, semester, condition, minPrice, maxPrice, searchQuery, sortBy } = query;

    const queryBuilder = bookRepository.createQueryBuilder("book")
        .leftJoinAndSelect("book.seller", "seller")
        .where("book.status = :status", { status: Status.ACTIVE });

    if (department && typeof department === 'string' && department.trim() !== '') {
      queryBuilder.andWhere("book.department = :department", { department });
    }

    if (semester) {
      const parsedSemester = parseInt(semester as string);
      if (!isNaN(parsedSemester)) {
        queryBuilder.andWhere("book.semester = :semester", { semester: parsedSemester });
      }
    }

    if (condition && Object.values(Condition).includes(condition as Condition)) {
      queryBuilder.andWhere("book.condition = :condition", { condition });
    }
    
    if (minPrice) {
      const parsedMinPrice = parseFloat(minPrice as string);
      if (!isNaN(parsedMinPrice)) {
        queryBuilder.andWhere("book.price >= :minPrice", { minPrice: parsedMinPrice });
      }
    }

    if (maxPrice) {
      const parsedMaxPrice = parseFloat(maxPrice as string);
      if (!isNaN(parsedMaxPrice)) {
        queryBuilder.andWhere("book.price <= :maxPrice", { maxPrice: parsedMaxPrice });
      }
    }

    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
        queryBuilder.andWhere(
            "(book.title ILIKE :search OR book.author ILIKE :search OR book.subject ILIKE :search OR book.tags ILIKE :search)", 
            { search: `%${searchQuery.trim()}%` }
        );
    }

    if (sortBy === 'price_asc') queryBuilder.orderBy("book.price", "ASC");
    else if (sortBy === 'price_desc') queryBuilder.orderBy("book.price", "DESC");
    else if (sortBy === 'views') queryBuilder.orderBy("book.viewsCount", "DESC");
    else queryBuilder.orderBy("book.createdAt", "DESC");

    const books = await queryBuilder.getMany();

    return books.map(book => ({
        ...book,
        seller: book.seller ? {
            id: book.seller.id,
            name: book.seller.name,
            avatarUrl: book.seller.avatarUrl,
        } : null
    }));
  }
}
