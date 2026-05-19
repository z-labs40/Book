import { DataSource } from "typeorm";
import { User } from "../adapters/models/User";
import { Book } from "../adapters/models/Book";
import { CartItem } from "../adapters/models/CartItem";
import { Order } from "../adapters/models/Order";
import { OrderItem } from "../adapters/models/OrderItem";
import { config } from "../config";
import { seedAdmin } from "./seed";
import { logger } from "../shared/loggers";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  synchronize: true, // Only for dev. In production use migrations!
  logging: false,
  entities: [User, Book, CartItem, Order, OrderItem],
  subscribers: [],
  migrations: [],
});

export const initDB = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Data Source has been initialized successfully!");
    await seedAdmin();
  } catch (err) {
    logger.error(`Error during Data Source initialization: ${err}`);
  }
};
