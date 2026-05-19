import { AppDataSource } from '../../../infrastructure/database';
import { Order } from '../../../adapters/models/Order';
import { logger } from '../../../shared/loggers';

export class StudentOrdersUseCase {
  // 1. Get student's purchase history (books they bought)
  async getPurchases(userId: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    return await orderRepo.find({
      where: { buyer: { id: userId } },
      relations: ['book', 'book.seller', 'seller'],
      order: { orderDate: 'DESC' }
    });
  }

  // 2. Get student's sales history (books they sold)
  async getSales(userId: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    return await orderRepo.find({
      where: { seller: { id: userId } },
      relations: ['book', 'buyer'],
      order: { orderDate: 'DESC' }
    });
  }

  // 3. Get single order details
  async getOrderDetails(userId: string, orderId: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ['book', 'buyer', 'seller']
    });

    if (!order) throw new Error("Order not found");

    // Enforce privacy: Only the buyer or seller can view this order
    if (order.buyer.id !== userId && order.seller.id !== userId) {
      throw new Error("Access denied. You are not authorized to view this order.");
    }

    return order;
  }
}
