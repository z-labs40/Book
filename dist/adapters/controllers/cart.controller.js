"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const CartUseCase_1 = require("../../application/use-cases/cart/CartUseCase");
const loggers_1 = require("../../shared/loggers");
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new CartUseCase_1.CartUseCase();
        const cart = await useCase.getCart(userId);
        res.json(cart);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get cart for user: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId, quantity } = req.body;
        const useCase = new CartUseCase_1.CartUseCase();
        const cartItem = await useCase.addToCart(userId, bookId, quantity || 1);
        res.status(201).json(cartItem);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to add to cart: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new CartUseCase_1.CartUseCase();
        const result = await useCase.removeFromCart(userId, req.params.id);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to remove from cart: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};
exports.removeFromCart = removeFromCart;
const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new CartUseCase_1.CartUseCase();
        const result = await useCase.checkout(userId);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Checkout failed for user ${req.user?.userId}: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};
exports.checkout = checkout;
