import Review from '../models/Review.js';
import Product from '../models/Products.js';

export const createReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const { comment, rating } = req.body;
        const userId = req.user.id;

        if (!comment || !rating) {
            return res.status(400).json({ success: false, message: 'Invalid review data' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const newReview = new Review({
            product: productId,
            user: userId,
            comment,
            rating
        });

        await newReview.save();

        // Fetch user information
        const user = await User.findById(userId).select('username profileImage');

        // Update product's review count and average rating
        product.reviews = (product.reviews || 0) + 1;
        product.rating = await calculateAverageRating(productId);
        await product.save();

        // Include user information in the response
        const reviewWithUser = {
            ...newReview.toObject(),
            user: {
                _id: user._id,
                username: user.username,
                profileImage: user.profileImage
            }
        };

        res.status(201).json({ success: true, review: reviewWithUser });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
    }
};


export const getReviewsByProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await Review.find({ product: productId })
            .populate('user', 'username profileImage')
            .sort({ createdAt: -1 });  // Sort by newest first

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
    }
};

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // ตรวจสอบว่าผู้ใช้มีสิทธิ์ลบรีวิวนี้
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this review' });
        }

        await Review.findByIdAndDelete(reviewId);

        // อัพเดทจำนวนรีวิวและคำนวณ rating เฉลี่ยใหม่
        await Product.findByIdAndUpdate(review.product, {
            $inc: { numReviews: -1 },
            $set: { rating: await calculateAverageRating(review.product) }
        });

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

// ฟังก์ชันช่วยคำนวณ rating เฉลี่ย
const calculateAverageRating = async (productId) => {
    const result = await Review.aggregate([
        { $match: { product: productId } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    return result.length > 0 ? result[0].averageRating : 0;
};

const reviewController = {
    createReview,
    getReviewsByProduct,
    deleteReview
};

export default reviewController;