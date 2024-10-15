import express from 'express';
import cartController from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/carts', authMiddleware, cartController.addToCart);
router.get('/carts', authMiddleware, cartController.getCart);
router.patch('/carts/:productId', authMiddleware, cartController.updateCart);
router.delete('/carts/:productId', authMiddleware, cartController.removeFromCart);
router.delete('/carts', authMiddleware, cartController.clearCart);


export default router;