"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const CartItem_1 = require("../adapters/models/CartItem");
const Book_1 = require("../adapters/models/Book");
const User_1 = require("../adapters/models/User");
const Order_1 = require("../adapters/models/Order");
const OrderItem_1 = require("../adapters/models/OrderItem");
const runTest = async () => {
    try {
        await database_1.AppDataSource.initialize();
        console.log("Connected to Supabase!");
        const cartRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        const orderItemRepo = database_1.AppDataSource.getRepository(OrderItem_1.OrderItem);
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
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
        }
        else {
            console.log("\nNo Cart Items currently exist in Supabase (or checkout cleared them).");
        }
        await database_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error("Test Query failed:", error);
    }
};
runTest();
