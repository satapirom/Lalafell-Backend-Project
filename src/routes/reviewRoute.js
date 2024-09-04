import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Define routes for Review
router.post('/reviews', authMiddleware, reviewController.createReview);
router.get('/reviews', authMiddleware, reviewController.getReviews);
router.get('/reviews/:reviewId', authMiddleware, reviewController.getReviewById);
router.patch('/reviews/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteReview);

export default router;
