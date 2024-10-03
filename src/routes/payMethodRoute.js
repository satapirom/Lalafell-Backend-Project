import express from 'express';
import paymentMethodController from '../controllers/paymentMethodController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all bank accounts for the user
router.get('/payment/bank-accounts', authMiddleware, paymentMethodController.getPayMethods);
router.post('/payment/bank-accounts', authMiddleware, paymentMethodController.validatePayMethod, paymentMethodController.createPayMethod);
router.patch('/payment/bank-accounts/:id', authMiddleware, paymentMethodController.validatePayMethod, paymentMethodController.updatePayMethod);
router.delete('/payment/bank-accounts/:id', authMiddleware, paymentMethodController.deletePayMethod);

// Get all credit cards for the user
router.get('/payment/credit-cards', authMiddleware, paymentMethodController.getPayMethods);
router.post('/payment/credit-cards', authMiddleware, paymentMethodController.validatePayMethod, paymentMethodController.createPayMethod);
router.patch('/payment/credit-cards/:id', authMiddleware, paymentMethodController.validatePayMethod, paymentMethodController.updatePayMethod);
router.delete('/payment/credit-cards/:id', authMiddleware, paymentMethodController.validatePayMethod, paymentMethodController.deletePayMethod);

export default router;

