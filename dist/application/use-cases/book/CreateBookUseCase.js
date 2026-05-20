"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Book_1 = require("../../../adapters/models/Book");
const loggers_1 = require("../../../shared/loggers");
class CreateBookUseCase {
    async execute(sellerId, bookData) {
        const bookRepository = database_1.AppDataSource.getRepository(Book_1.Book);
        bookData.seller = { id: sellerId };
        // Explicitly casting bookData to prevent TypeORM from inferring an array type
        const newBook = bookRepository.create(bookData);
        await bookRepository.save(newBook);
        loggers_1.logger.info(`Book created: ${newBook.id} by seller: ${sellerId}`);
        return newBook;
    }
}
exports.CreateBookUseCase = CreateBookUseCase;
