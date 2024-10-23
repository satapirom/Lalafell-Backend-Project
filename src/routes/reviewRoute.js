import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/products/:id/reviews', authMiddleware, upload.array('images'), reviewController.createReview);
router.get('/products/:id/reviews', reviewController.getReviewsByProduct);
router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteReview);

export default router;