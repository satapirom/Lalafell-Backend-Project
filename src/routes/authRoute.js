import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post("/api/v1/register", authController.register);
router.post("/api/v1/login", authController.login);
router.post("/api/v1/logout", authController.logout);

export default router;