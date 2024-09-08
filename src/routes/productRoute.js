import express from 'express';
import productController from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
    }
});

const upload = multer({
    storage
});


const router = express.Router();

router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProductById);
router.post('/products', upload.array('images'), productController.createProduct);
router.patch('/products/:productId', adminAuthMiddleware, productController.updateProduct);
router.delete('/products/:productId', adminAuthMiddleware, productController.deleteProduct);
router.get('/products/search', productController.searchProducts);



export default router;