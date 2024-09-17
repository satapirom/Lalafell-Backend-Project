import express from 'express';
import productsController from '../controllers/productsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import multer from 'multer';

const router = express.Router();
router.post('/upload', productsController.uploadProduct);

export default router;
