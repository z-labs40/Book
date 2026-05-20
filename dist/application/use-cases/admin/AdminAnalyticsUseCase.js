"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsUseCase = void 0;
const database_1 = require("../../../infrastructure/database");
const Book_1 = require("../../../adapters/models/Book");
const Order_1 = require("../../../adapters/models/Order");
class AdminAnalyticsUseCase {
    async getOverview() {
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        const totalActiveListings = await bookRepo.count({
            where: { available: true, status: Book_1.Status.ACTIVE }
        });
        const totalCustomerOrders = await orderRepo.count();
        const { sum } = await orderRepo
            .createQueryBuilder("order")
            .select("SUM(order.totalAmount)", "sum")
            .getRawOne();
        const totalTransactionVolume = parseFloat(sum || 0);
        return {
            totalActiveListings,
            totalCustomerOrders,
            totalTransactionVolume
        };
    }
}
exports.AdminAnalyticsUseCase = AdminAnalyticsUseCase;
