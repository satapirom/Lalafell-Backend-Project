import express from 'express';
import productController from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/products', productController.getAllProducts);
router.get('/product/:id', productController.getProductById);
router.post('/product', productController.createProduct);
router.patch('/product/:id', productController.updateProduct);
router.delete('/product/:id', productController.deleteProduct);
router.get('/search', productController.searchProducts);

export default router;