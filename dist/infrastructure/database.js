"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../adapters/models/User");
const Book_1 = require("../adapters/models/Book");
const CartItem_1 = require("../adapters/models/CartItem");
const Order_1 = require("../adapters/models/Order");
const OrderItem_1 = require("../adapters/models/OrderItem");
const config_1 = require("../config");
const seed_1 = require("./seed");
const loggers_1 = require("../shared/loggers");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config_1.config.database.host,
    port: config_1.config.database.port,
    username: config_1.config.database.username,
    password: config_1.config.database.password,
    database: config_1.config.database.name,
    ssl: config_1.config.database.ssl ? { rejectUnauthorized: false } : false,
    synchronize: true, // Only for dev. In production use migrations!
    logging: false,
    entities: [User_1.User, Book_1.Book, CartItem_1.CartItem, Order_1.Order, OrderItem_1.OrderItem],
    subscribers: [],
    migrations: [],
});
const initDB = async () => {
    try {
        await exports.AppDataSource.initialize();
        loggers_1.logger.info("Data Source has been initialized successfully!");
        await (0, seed_1.seedAdmin)();
    }
    catch (err) {
        loggers_1.logger.error(`Error during Data Source initialization: ${err}`);
    }
};
exports.initDB = initDB;
