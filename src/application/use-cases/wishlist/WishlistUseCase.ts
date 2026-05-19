import { AppDataSource } from '../../../infrastructure/database';
import { Book } from '../../../adapters/models/Book';
import { User } from '../../../adapters/models/User';
import { logger } from '../../../shared/loggers';

export class WishlistUseCase {
  async getWishlist(userId: string) {
    const bookRepo = AppDataSource.getRepository(Book);
    return await bookRepo.createQueryBuilder("book")
      .innerJoin("book.wishlistedBy", "user", "user.id = :userId", { userId })
      .leftJoinAndSelect("book.seller", "seller")
      .getMany();
  }

  async toggleWishlist(userId: string, bookId: string) {
    const bookRepo = AppDataSource.getRepository(Book);
    const userRepo = AppDataSource.getRepository(User);

    const book = await bookRepo.findOne({
      where: { id: bookId },
      relations: ['wishlistedBy']
    });

    if (!book) throw new Error("Book not found");

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const index = book.wishlistedBy.findIndex(u => u.id === userId);
    let wishlisted = false;

    if (index > -1) {
      // Remove from wishlist
      book.wishlistedBy.splice(index, 1);
      wishlisted = false;
      logger.info(`Removed book ${bookId} from user ${userId} wishlist`);
    } else {
      // Add to wishlist
      book.wishlistedBy.push(user);
      wishlisted = true;
      logger.info(`Added book ${bookId} to user ${userId} wishlist`);
    }

    await bookRepo.save(book);
    return { wishlisted, message: wishlisted ? "Book added to wishlist" : "Book removed from wishlist" };
  }
}
