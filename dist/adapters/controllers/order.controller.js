"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = exports.getSales = exports.getPurchases = void 0;
const StudentOrdersUseCase_1 = require("../../application/use-cases/order/StudentOrdersUseCase");
const loggers_1 = require("../../shared/loggers");
const getPurchases = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new StudentOrdersUseCase_1.StudentOrdersUseCase();
        const purchases = await useCase.getPurchases(userId);
        res.json(purchases);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get purchases for student ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch purchase history' });
    }
};
exports.getPurchases = getPurchases;
const getSales = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new StudentOrdersUseCase_1.StudentOrdersUseCase();
        const sales = await useCase.getSales(userId);
        res.json(sales);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get sales for student ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch sales history' });
    }
};
exports.getSales = getSales;
const getOrderDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new StudentOrdersUseCase_1.StudentOrdersUseCase();
        const order = await useCase.getOrderDetails(userId, req.params.id);
        res.json(order);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get order details: ${error.message}`);
        if (error.message.includes('Access denied')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(404).json({ error: error.message });
    }
};
exports.getOrderDetails = getOrderDetails;
