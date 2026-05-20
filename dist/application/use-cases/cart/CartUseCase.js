"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const CartItem_1 = require("../../../adapters/models/CartItem");
const Book_1 = require("../../../adapters/models/Book");
const User_1 = require("../../../adapters/models/User");
const Order_1 = require("../../../adapters/models/Order");
const OrderItem_1 = require("../../../adapters/models/OrderItem");
const loggers_1 = require("../../../shared/loggers");
class CartUseCase {
    async getCart(userId) {
        const cartRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
        return await cartRepo.find({
            where: { user: { id: userId } },
            relations: ['book', 'book.seller']
        });
    }
    async addToCart(userId, bookId, quantity = 1) {
        const cartRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const book = await bookRepo.findOneBy({ id: bookId });
        if (!book)
            throw new Error("Book not found");
        if (!book.available)
            throw new Error("Book is not available for purchase");
        const user = await userRepo.findOneBy({ id: userId });
        if (!user)
            throw new Error("User not found");
        // Check if item already exists in cart
        let cartItem = await cartRepo.findOne({
            where: { user: { id: userId }, book: { id: bookId } }
        });
        if (cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cartItem = cartRepo.create({
                user,
                book,
                quantity
            });
        }
        await cartRepo.save(cartItem);
        loggers_1.logger.info(`Added book ${bookId} to user ${userId} cart`);
        return cartItem;
    }
    async removeFromCart(userId, cartItemId) {
        const cartRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
        const cartItem = await cartRepo.findOne({
            where: { id: cartItemId, user: { id: userId } }
        });
        if (!cartItem)
            throw new Error("Cart item not found");
        await cartRepo.remove(cartItem);
        loggers_1.logger.info(`Removed cart item ${cartItemId} for user ${userId}`);
        return { message: "Item removed from cart successfully" };
    }
    async checkout(userId) {
        const cartRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        const orderItemRepo = database_1.AppDataSource.getRepository(OrderItem_1.OrderItem);
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepo.findOneBy({ id: userId });
        if (!user)
            throw new Error("User not found");
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
            totalAmount += parseFloat(item.book.price) * item.quantity;
        }
        // Create the Order
        // For simplicity, if there are multiple items, we set the book and seller relations to the first item's details.
        // Order items table will maintain individual items.
        const firstItem = cartItems[0];
        const order = orderRepo.create({
            totalAmount,
            status: Order_1.OrderStatus.PENDING,
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
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        for (const item of cartItems) {
            item.book.available = false;
            await bookRepo.save(item.book);
        }
        // Clear user's cart
        await cartRepo.remove(cartItems);
        loggers_1.logger.info(`Successful checkout for user ${userId}. Created order: ${order.id}`);
        return {
            message: "Order placed successfully",
            orderId: order.id,
            totalAmount,
            status: order.status
        };
    }
}
exports.CartUseCase = CartUseCase;
