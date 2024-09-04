import express from 'express';
import paymentMethodController from '../controllers/paymentMethodController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/paymethods', authMiddleware, paymentMethodController.getPayMethods);
router.get('/paymethods/:payMethodId', authMiddleware, paymentMethodController.getPayMethodById);
router.post('/paymethods', authMiddleware, paymentMethodController.createPayMethod);
router.patch('/paymethods/:payMethodId', authMiddleware, paymentMethodController.updatePayMethod);
router.delete('/paymethods/:payMethodId', authMiddleware, paymentMethodController.deletePayMethod);

export default router;