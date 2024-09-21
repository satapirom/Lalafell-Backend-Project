import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/products/:id/reviews', authMiddleware, reviewController.createReview);
router.get('/products/:id/reviews', authMiddleware, reviewController.getReviewsByProduct);
router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteReview);

export default router;