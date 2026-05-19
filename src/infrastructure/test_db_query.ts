import { AppDataSource } from './database';
import { CartItem } from '../adapters/models/CartItem';
import { Book } from '../adapters/models/Book';
import { User } from '../adapters/models/User';
import { Order } from '../adapters/models/Order';
import { OrderItem } from '../adapters/models/OrderItem';

const runTest = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to Supabase!");

    const cartRepo = AppDataSource.getRepository(CartItem);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const userRepo = AppDataSource.getRepository(User);
    const bookRepo = AppDataSource.getRepository(Book);

    const carts = await cartRepo.find({ relations: ['user', 'book'] });
    const orders = await orderRepo.find({ relations: ['buyer', 'seller', 'book'] });
    const orderItems = await orderItemRepo.find({ relations: ['order', 'book'] });
    const users = await userRepo.find();
    const books = await bookRepo.find();

    console.log("\n--- SUPABASE DATA VERIFICATION ---");
    console.log(`Total Users in DB: ${users.length}`);
    console.log(`Total Books in DB: ${books.length}`);
    console.log(`Total Cart Items in DB: ${carts.length}`);
    console.log(`Total Orders in DB: ${orders.length}`);
    console.log(`Total Order Items in DB: ${orderItems.length}`);

    if (carts.length > 0) {
      console.log("\nCart Items details:");
      carts.forEach((c, idx) => {
        console.log(`[Cart ${idx + 1}] ID: ${c.id}, Qty: ${c.quantity}, User: ${c.user?.email}, Book: ${c.book?.title}`);
      });
    } else {
      console.log("\nNo Cart Items currently exist in Supabase (or checkout cleared them).");
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Test Query failed:", error);
  }
};

runTest();
