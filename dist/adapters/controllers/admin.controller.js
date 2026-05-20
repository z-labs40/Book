"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.deleteBook = exports.approveBook = exports.getBooks = exports.getAnalyticsOverview = exports.adminLogout = exports.adminLogin = void 0;
const LoginUserUseCase_1 = require("../../application/use-cases/auth/LoginUserUseCase");
const AdminAnalyticsUseCase_1 = require("../../application/use-cases/admin/AdminAnalyticsUseCase");
const AdminBooksUseCase_1 = require("../../application/use-cases/admin/AdminBooksUseCase");
const AdminOrdersUseCase_1 = require("../../application/use-cases/admin/AdminOrdersUseCase");
const loggers_1 = require("../../shared/loggers");
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const useCase = new LoginUserUseCase_1.LoginUserUseCase();
        const result = await useCase.execute({ email, password, isAdminLogin: true });
        // Set secure HTTP-only cookie
        res.cookie('admin_token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Admin login failed for ${req.body?.email}: ${error.message}`);
        if (error.message === 'Invalid credentials' || error.message.includes('Access denied')) {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.adminLogin = adminLogin;
const adminLogout = async (req, res) => {
    res.clearCookie('admin_token');
    loggers_1.logger.info('Admin logged out successfully');
    res.json({ message: 'Logged out successfully' });
};
exports.adminLogout = adminLogout;
const getAnalyticsOverview = async (req, res) => {
    try {
        const useCase = new AdminAnalyticsUseCase_1.AdminAnalyticsUseCase();
        const overview = await useCase.getOverview();
        res.json(overview);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get analytics overview: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
};
exports.getAnalyticsOverview = getAnalyticsOverview;
const getBooks = async (req, res) => {
    try {
        const useCase = new AdminBooksUseCase_1.AdminBooksUseCase();
        const result = await useCase.getBooks(req.query);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Admin failed to get books: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};
exports.getBooks = getBooks;
const approveBook = async (req, res) => {
    try {
        const useCase = new AdminBooksUseCase_1.AdminBooksUseCase();
        const book = await useCase.approveBook(req.params.id);
        res.json({ message: 'Book listing approved successfully', book });
    }
    catch (error) {
        loggers_1.logger.error(`Admin failed to approve book ${req.params.id}: ${error.message}`);
        if (error.message.includes('not found') || error.message.includes('state')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to approve book listing' });
    }
};
exports.approveBook = approveBook;
const deleteBook = async (req, res) => {
    try {
        const useCase = new AdminBooksUseCase_1.AdminBooksUseCase();
        const result = await useCase.deleteBook(req.params.id);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Admin failed to delete book ${req.params.id}: ${error.message}`);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete book listing' });
    }
};
exports.deleteBook = deleteBook;
const getOrders = async (req, res) => {
    try {
        const useCase = new AdminOrdersUseCase_1.AdminOrdersUseCase();
        const result = await useCase.getOrders(req.query);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Admin failed to get orders: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const useCase = new AdminOrdersUseCase_1.AdminOrdersUseCase();
        const order = await useCase.updateOrderStatus(req.params.id, status);
        res.json({ message: 'Order status updated successfully', order });
    }
    catch (error) {
        loggers_1.logger.error(`Admin failed to update order ${req.params.id}: ${error.message}`);
        if (error.message.includes('not found') || error.message.includes('Invalid status')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
