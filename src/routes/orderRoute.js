import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/orders', authMiddleware, adminAuthMiddleware, orderController.getOrders);
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/order/:orderId', authMiddleware, adminAuthMiddleware, orderController.getOrderById);
router.patch('/orders/:orderId', authMiddleware, orderController.updateOrder);
router.delete('/orders/:orderId', authMiddleware, orderController.deleteOrder);
export default router;