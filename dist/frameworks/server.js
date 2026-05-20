"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../config");
const database_1 = require("../infrastructure/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const loggers_1 = require("../shared/loggers");
const app = (0, express_1.default)();
const PORT = config_1.config.port;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/books', book_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.get("/", (req, res) => {
    res.send("BookResale API is running...");
});
// Live server entry point
app.listen(PORT, async () => {
    loggers_1.logger.info(`Server is running on port ${PORT}`);
    await (0, database_1.initDB)();
});
