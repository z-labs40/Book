"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Book_1 = require("../../../adapters/models/Book");
const User_1 = require("../../../adapters/models/User");
const loggers_1 = require("../../../shared/loggers");
class WishlistUseCase {
    async getWishlist(userId) {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        return await bookRepo.createQueryBuilder("book")
            .innerJoin("book.wishlistedBy", "user", "user.id = :userId", { userId })
            .leftJoinAndSelect("book.seller", "seller")
            .getMany();
    }
    async toggleWishlist(userId, bookId) {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const book = await bookRepo.findOne({
            where: { id: bookId },
            relations: ['wishlistedBy']
        });
        if (!book)
            throw new Error("Book not found");
        const user = await userRepo.findOneBy({ id: userId });
        if (!user)
            throw new Error("User not found");
        const index = book.wishlistedBy.findIndex(u => u.id === userId);
        let wishlisted = false;
        if (index > -1) {
            // Remove from wishlist
            book.wishlistedBy.splice(index, 1);
            wishlisted = false;
            loggers_1.logger.info(`Removed book ${bookId} from user ${userId} wishlist`);
        }
        else {
            // Add to wishlist
            book.wishlistedBy.push(user);
            wishlisted = true;
            loggers_1.logger.info(`Added book ${bookId} to user ${userId} wishlist`);
        }
        await bookRepo.save(book);
        return { wishlisted, message: wishlisted ? "Book added to wishlist" : "Book removed from wishlist" };
    }
}
exports.WishlistUseCase = WishlistUseCase;
