import express from 'express';
import productsController from '../controllers/productsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Public routes
router.get('/products', productsController.getProducts);
router.get('/products/search', productsController.searchProducts);

// Authenticated routes
router.get('/products/filter', authMiddleware, productsController.getProductFilter);
router.get('/products/:id', authMiddleware, productsController.getProductByID);

// Admin routes
router.post('/products', adminAuthMiddleware, upload.array('images'), productsController.uploadProduct);

export default router;
