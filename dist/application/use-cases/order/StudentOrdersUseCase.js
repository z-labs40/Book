"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentOrdersUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Order_1 = require("../../../adapters/models/Order");
class StudentOrdersUseCase {
    // 1. Get student's purchase history (books they bought)
    async getPurchases(userId) {
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        return await orderRepo.find({
            where: { buyer: { id: userId } },
            relations: ['book', 'book.seller', 'seller'],
            order: { orderDate: 'DESC' }
        });
    }
    // 2. Get student's sales history (books they sold)
    async getSales(userId) {
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        return await orderRepo.find({
            where: { seller: { id: userId } },
            relations: ['book', 'buyer'],
            order: { orderDate: 'DESC' }
        });
    }
    // 3. Get single order details
    async getOrderDetails(userId, orderId) {
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        const order = await orderRepo.findOne({
            where: { id: orderId },
            relations: ['book', 'buyer', 'seller']
        });
        if (!order)
            throw new Error("Order not found");
        // Enforce privacy: Only the buyer or seller can view this order
        if (order.buyer.id !== userId && order.seller.id !== userId) {
            throw new Error("Access denied. You are not authorized to view this order.");
        }
        return order;
    }
}
exports.StudentOrdersUseCase = StudentOrdersUseCase;
