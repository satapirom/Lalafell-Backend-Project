import express from 'express';
import checkoutController from '../controllers/checkoutController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/checkouts', authMiddleware, checkoutController.createCheckout);
router.get('/checkouts', authMiddleware, adminAuthMiddleware, checkoutController.getCheckouts);
router.get('/checkouts/:checkoutId', authMiddleware, checkoutController.getCheckoutById);
router.patch('/checkouts/:checkoutId', authMiddleware, checkoutController.updateCheckout);
router.delete('/checkouts/:checkoutId', authMiddleware, checkoutController.deleteCheckout);

export default router;