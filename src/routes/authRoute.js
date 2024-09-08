import express from 'express';
import multer from 'multer';
import authController from '../controllers/authController.js';

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/register", upload.single("image"), authController.register);
router.post("/login", authController.login);

export default router;