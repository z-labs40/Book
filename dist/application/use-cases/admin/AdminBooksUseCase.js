"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBooksUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Book_1 = require("../../../adapters/models/Book");
const loggers_1 = require("../../../shared/loggers");
class AdminBooksUseCase {
    async getBooks(query) {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const status = query.status;
        const whereClause = {};
        if (status && Object.values(Book_1.Status).includes(status)) {
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
                    rating: parseFloat(b.seller.rating || 5.0)
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
    async approveBook(id) {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const book = await bookRepo.findOneBy({ id });
        if (!book)
            throw new Error("Book not found");
        if (book.status === Book_1.Status.ACTIVE) {
            return book;
        }
        book.status = Book_1.Status.ACTIVE;
        book.available = true;
        await bookRepo.save(book);
        loggers_1.logger.info(`Admin approved book listing: ${id}`);
        return book;
    }
    async deleteBook(id) {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const book = await bookRepo.findOneBy({ id });
        if (!book)
            throw new Error("Book not found");
        book.status = Book_1.Status.REJECTED;
        book.available = false;
        await bookRepo.save(book);
        loggers_1.logger.info(`Admin soft-deleted / rejected book listing: ${id}`);
        return { message: "Book listing archived successfully" };
    }
}
exports.AdminBooksUseCase = AdminBooksUseCase;
