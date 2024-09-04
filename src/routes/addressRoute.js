import express from 'express';
import addressController from '../controllers/addressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/address', authMiddleware, adminAuthMiddleware, addressController.getAddresses);
router.get('/address/:addressId', authMiddleware, adminAuthMiddleware, addressController.getAddressesById);
router.post('/address', authMiddleware, addressController.createAddress);
router.patch('/address/:addressId', authMiddleware, addressController.updateAddress);
router.delete('/address/:addressId', authMiddleware, addressController.deleteAddress);

export default router;