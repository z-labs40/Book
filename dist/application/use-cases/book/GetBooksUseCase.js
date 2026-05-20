"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBooksUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Book_1 = require("../../../adapters/models/Book");
class GetBooksUseCase {
    async execute(query) {
        const bookRepository = database_1.AppDataSource.getRepository(Book_1.Book);
        const { department, semester, condition, minPrice, maxPrice, searchQuery, sortBy } = query;
        const queryBuilder = bookRepository.createQueryBuilder("book")
            .leftJoinAndSelect("book.seller", "seller")
            .where("book.status = :status", { status: Book_1.Status.ACTIVE })
            .andWhere("book.available = :available", { available: true });
        if (department && typeof department === 'string' && department.trim() !== '') {
            queryBuilder.andWhere("book.department = :department", { department });
        }
        if (semester) {
            const parsedSemester = parseInt(semester);
            if (!isNaN(parsedSemester)) {
                queryBuilder.andWhere("book.semester = :semester", { semester: parsedSemester });
            }
        }
        if (condition && Object.values(Book_1.Condition).includes(condition)) {
            queryBuilder.andWhere("book.condition = :condition", { condition });
        }
        if (minPrice) {
            const parsedMinPrice = parseFloat(minPrice);
            if (!isNaN(parsedMinPrice)) {
                queryBuilder.andWhere("book.price >= :minPrice", { minPrice: parsedMinPrice });
            }
        }
        if (maxPrice) {
            const parsedMaxPrice = parseFloat(maxPrice);
            if (!isNaN(parsedMaxPrice)) {
                queryBuilder.andWhere("book.price <= :maxPrice", { maxPrice: parsedMaxPrice });
            }
        }
        if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
            queryBuilder.andWhere("(book.title ILIKE :search OR book.author ILIKE :search OR book.subject ILIKE :search OR book.tags ILIKE :search)", { search: `%${searchQuery.trim()}%` });
        }
        if (sortBy === 'price_asc')
            queryBuilder.orderBy("book.price", "ASC");
        else if (sortBy === 'price_desc')
            queryBuilder.orderBy("book.price", "DESC");
        else if (sortBy === 'views')
            queryBuilder.orderBy("book.viewsCount", "DESC");
        else
            queryBuilder.orderBy("book.createdAt", "DESC");
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
exports.GetBooksUseCase = GetBooksUseCase;
