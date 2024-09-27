import express from 'express';
import addressController from '../controllers/addressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

// User routes
router.get('/address/user', authMiddleware, addressController.getUserAddresses);
router.post('/address/user', authMiddleware, addressController.createAddress);
router.patch('/address/user/:id', authMiddleware, addressController.updateUserAddress);
router.delete('/address/user/:id', authMiddleware, addressController.deleteUserAddress);



export default router;