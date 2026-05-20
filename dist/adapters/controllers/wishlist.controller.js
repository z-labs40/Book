"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishlist = void 0;
const WishlistUseCase_1 = require("../../application/use-cases/wishlist/WishlistUseCase");
const loggers_1 = require("../../shared/loggers");
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const useCase = new WishlistUseCase_1.WishlistUseCase();
        const wishlist = await useCase.getWishlist(userId);
        res.json(wishlist);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to get wishlist: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch wishlist items' });
    }
};
exports.getWishlist = getWishlist;
const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookId = req.params.bookId;
        const useCase = new WishlistUseCase_1.WishlistUseCase();
        const result = await useCase.toggleWishlist(userId, bookId);
        res.json(result);
    }
    catch (error) {
        loggers_1.logger.error(`Failed to toggle wishlist: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};
exports.toggleWishlist = toggleWishlist;
