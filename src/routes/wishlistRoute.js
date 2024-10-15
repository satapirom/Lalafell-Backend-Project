import express from 'express';
import wishlistController from '../controllers/wishlistController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/wishlist', authMiddleware, wishlistController.getUserWishlist);
router.post('/wishlist', authMiddleware, wishlistController.addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, wishlistController.removeFromWishlist);
router.post('/wishlist/toggle', authMiddleware, wishlistController.toggleWishlistItem);

export default router;  