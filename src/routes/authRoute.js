import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authController from '../controllers/authController.js';

// ใช้ __filename และ __dirname ใน ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ตั้งค่าการจัดเก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // ใช้ path.join กับ __dirname เพื่อให้แน่ใจว่า path ถูกต้อง
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์เป็นชื่อเดิม + timestamp เพื่อลดความเสี่ยงของการซ้ำกัน
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ไม่เกิน 5MB
    fileFilter: (req, file, cb) => {
        // ตรวจสอบประเภทไฟล์ที่อนุญาต
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    }
});

const router = express.Router();

// เส้นทางสำหรับการลงทะเบียน
router.post("/register", upload.single("img"), authController.register);

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post("/login", authController.login);

export default router;

