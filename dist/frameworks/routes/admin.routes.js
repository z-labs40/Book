"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_controller_1 = require("../../adapters/controllers/admin.controller");
const router = (0, express_1.Router)();
// Public Admin Auth Routes
router.post('/auth/login', admin_controller_1.adminLogin);
router.post('/auth/logout', admin_controller_1.adminLogout);
// All routes below require valid token + admin role
router.use(auth_middleware_1.authenticateToken, auth_middleware_1.requireAdmin);
// Analytics & KPI Overview
router.get('/analytics/overview', admin_controller_1.getAnalyticsOverview);
// Tab 1: Book Listings Management
router.get('/books', admin_controller_1.getBooks);
router.patch('/books/:id/approve', admin_controller_1.approveBook);
router.delete('/books/:id', admin_controller_1.deleteBook);
// Tab 2: Customer Orders Management
router.get('/orders', admin_controller_1.getOrders);
router.patch('/orders/:id/status', admin_controller_1.updateOrderStatus);
exports.default = router;
