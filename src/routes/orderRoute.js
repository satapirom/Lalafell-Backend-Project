import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/orders', authMiddleware, adminAuthMiddleware, orderController.getOrders);
router.post('/order', authMiddleware, orderController.createOrder);
router.get('/order/:orderId', authMiddleware, orderController.getOrderById);
router.delete('/order/:orderId', authMiddleware, orderController.deleteOrder);

export default router;