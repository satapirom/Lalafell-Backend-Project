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
router.get('/products', productsController.getProducts);
router.get('/products', authMiddleware, productsController.getProductFilter);
router.get('/products/:id', authMiddleware, productsController.getProductByID);

// Admin routes
router.post('/products', upload.array('images'), productsController.uploadProduct);

export default router;
