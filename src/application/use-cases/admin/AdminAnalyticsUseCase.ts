import { AppDataSource } from '../../../infrastructure/database';
import { Book, Status } from '../../../adapters/models/Book';
import { Order, OrderStatus } from '../../../adapters/models/Order';

export class AdminAnalyticsUseCase {
  async getOverview() {
    const bookRepo = AppDataSource.getRepository(Book);
    const orderRepo = AppDataSource.getRepository(Order);

    const totalActiveListings = await bookRepo.count({
      where: { available: true, status: Status.ACTIVE }
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
