import "reflect-metadata";
import express from "express";
import cors from "cors";
import { config } from "../config";
import { initDB } from "../infrastructure/database";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import adminRoutes from "./routes/admin.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import orderRoutes from "./routes/order.routes";
import { logger } from "../shared/loggers";

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

app.get("/", (req, res) => {
  res.send("BookResale API is running...");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// Live server entry point
app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  await initDB();
});
