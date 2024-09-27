import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import multer from 'multer';

// ตั้งค่า multer สำหรับจัดการการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,  // ค่าของ multer storage ที่กำหนดไว้
});

// ประกาศ Router
const router = express.Router();

// Route สำหรับการอัปโหลดภาพโปรไฟล์และภาพปกในคำขอเดียวกัน
router.post('/users/profile/upload', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), authMiddleware, userController.uploadProfileAndCoverImg);

// Route สำหรับการดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/user', authMiddleware, adminAuthMiddleware, userController.getUser);

// Route สำหรับดึงข้อมูลโปรไฟล์ของผู้ใช้
router.get('/users/profile', authMiddleware, userController.getProfile);

// Route สำหรับอัปเดตโปรไฟล์ของผู้ใช้
router.patch('/profile', authMiddleware, userController.updateProfile);

export default router;





