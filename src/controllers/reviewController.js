import Review from "../models/Reviews.js";
import User from "../models/User.js";
import Product from "../models/Products.js";

// Create a review
const createReview = async (req, res) => {
    const { user, product, rating, comment } = req.body;

    try {
        // Check if user and product exist
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ error: true, message: "Product not found" });
        }

        // Create a new review
        const newReview = new Review({ user, product, rating, comment });
        const savedReview = await newReview.save();

        return res.status(201).json({ error: false, message: "Review created successfully", data: savedReview });
    } catch (error) {
        console.error(`Error creating review: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user').populate('product');
        return res.json({ error: false, reviews });
    } catch (error) {
        console.error(`Error getting reviews: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get a review by ID
const getReviewById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId).populate('user').populate('product');
        if (!review) {
            return res.status(404).json({ error: true, message: "Review not found" });
        }
        return res.json({ error: false, review });
    } catch (error) {
        console.error(`Error getting review: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Update a review
const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: true, message: "Review not found" });
        }

        // Update review details
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();
        return res.json({ error: false, message: "Review updated successfully", data: updatedReview });
    } catch (error) {
        console.error(`Error updating review: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: true, message: "Review not found" });
        }

        await Review.deleteOne({ _id: reviewId });
        return res.json({ error: false, message: "Review deleted successfully" });
    } catch (error) {
        console.error(`Error deleting review: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const reviewController = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
};

export default reviewController;
