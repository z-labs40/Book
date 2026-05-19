import { AppDataSource } from '../../../infrastructure/database';
import { Order, OrderStatus } from '../../../adapters/models/Order';
import { User } from '../../../adapters/models/User';
import { logger } from '../../../shared/loggers';

export class AdminOrdersUseCase {
  async getOrders(query: any) {
    const orderRepo = AppDataSource.getRepository(Order);
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const status = query.status as OrderStatus;

    const whereClause: any = {};
    if (status && Object.values(OrderStatus).includes(status)) {
      whereClause.status = status;
    }

    const [orders, total] = await orderRepo.findAndCount({
      where: whereClause,
      relations: ['book', 'buyer', 'seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { orderDate: 'DESC' }
    });

    return {
      orders: orders.map(o => ({
        id: o.id,
        totalAmount: o.totalAmount,
        status: o.status,
        orderDate: o.orderDate,
        book: o.book ? {
          id: o.book.id,
          title: o.book.title,
          price: o.book.price,
          imageUrl: o.book.imageUrl
        } : null,
        buyer: o.buyer ? {
          id: o.buyer.id,
          name: o.buyer.name,
          email: o.buyer.email,
          department: o.buyer.department
        } : null,
        seller: o.seller ? {
          id: o.seller.id,
          name: o.seller.name,
          email: o.seller.email,
          department: o.seller.department
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

  async updateOrderStatus(id: string, status: OrderStatus) {
    const orderRepo = AppDataSource.getRepository(Order);
    const userRepo = AppDataSource.getRepository(User);

    const order = await orderRepo.findOne({
      where: { id },
      relations: ['seller']
    });

    if (!order) throw new Error("Order not found");

    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error("Invalid status value");
    }

    const previousStatus = order.status;
    order.status = status;
    await orderRepo.save(order);

    // If marked as completed and wasn't completed before, increment seller's totalSales
    if (status === OrderStatus.COMPLETED && previousStatus !== OrderStatus.COMPLETED && order.seller) {
      order.seller.totalSales = (order.seller.totalSales || 0) + 1;
      await userRepo.save(order.seller);
      logger.info(`Incremented totalSales for seller ${order.seller.id}`);
    }

    logger.info(`Admin updated order ${id} status to ${status}`);
    return order;
  }
}
