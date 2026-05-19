import { AppDataSource } from '../../../infrastructure/database';
import { CartItem } from '../../../adapters/models/CartItem';
import { Book } from '../../../adapters/models/Book';
import { User } from '../../../adapters/models/User';
import { Order, OrderStatus } from '../../../adapters/models/Order';
import { OrderItem } from '../../../adapters/models/OrderItem';
import { logger } from '../../../shared/loggers';

export class CartUseCase {
  async getCart(userId: string) {
    const cartRepo = AppDataSource.getRepository(CartItem);
    return await cartRepo.find({
      where: { user: { id: userId } },
      relations: ['book', 'book.seller']
    });
  }

  async addToCart(userId: string, bookId: string, quantity = 1) {
    const cartRepo = AppDataSource.getRepository(CartItem);
    const bookRepo = AppDataSource.getRepository(Book);
    const userRepo = AppDataSource.getRepository(User);

    const book = await bookRepo.findOneBy({ id: bookId });
    if (!book) throw new Error("Book not found");
    if (!book.available) throw new Error("Book is not available for purchase");

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    // Check if item already exists in cart
    let cartItem = await cartRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } }
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = cartRepo.create({
        user,
        book,
        quantity
      });
    }

    await cartRepo.save(cartItem);
    logger.info(`Added book ${bookId} to user ${userId} cart`);
    return cartItem;
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartRepo = AppDataSource.getRepository(CartItem);
    const cartItem = await cartRepo.findOne({
      where: { id: cartItemId, user: { id: userId } }
    });

    if (!cartItem) throw new Error("Cart item not found");

    await cartRepo.remove(cartItem);
    logger.info(`Removed cart item ${cartItemId} for user ${userId}`);
    return { message: "Item removed from cart successfully" };
  }

  async checkout(userId: string) {
    const cartRepo = AppDataSource.getRepository(CartItem);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const cartItems = await cartRepo.find({
      where: { user: { id: userId } },
      relations: ['book', 'book.seller']
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Determine the total amount
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += parseFloat(item.book.price as any) * item.quantity;
    }

    // Create the Order
    // For simplicity, if there are multiple items, we set the book and seller relations to the first item's details.
    // Order items table will maintain individual items.
    const firstItem = cartItems[0];
    const order = orderRepo.create({
      totalAmount,
      status: OrderStatus.PENDING,
      buyer: user,
      seller: firstItem.book.seller,
      book: firstItem.book
    });

    await orderRepo.save(order);

    // Create OrderItems
    const orderItemsToSave = cartItems.map(item => {
      return orderItemRepo.create({
        order,
        book: item.book,
        priceAtTime: item.book.price
      });
    });

    await orderItemRepo.save(orderItemsToSave);

    // Mark books as sold / unavailable
    const bookRepo = AppDataSource.getRepository(Book);
    for (const item of cartItems) {
      item.book.available = false;
      await bookRepo.save(item.book);
    }

    // Clear user's cart
    await cartRepo.remove(cartItems);

    logger.info(`Successful checkout for user ${userId}. Created order: ${order.id}`);
    return {
      message: "Order placed successfully",
      orderId: order.id,
      totalAmount,
      status: order.status
    };
  }
}
