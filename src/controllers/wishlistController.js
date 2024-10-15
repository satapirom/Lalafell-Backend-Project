import Wishlist from '../models/Wishlist.js';
import Product from "../models/Products.js";
import User from '../models/User.js';

const wishlistController = {
    // Toggle a product in the wishlist
    toggleWishlistItem: async (req, res) => {
        console.log('Received request body:', req.body);

        try {
            const userId = req.user.id; // Assuming you're using authentication middleware
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const existingItem = await Wishlist.findOne({ user: userId, product: productId });

            if (existingItem) {
                // If the item exists, remove it
                await Wishlist.findOneAndDelete({ user: userId, product: productId });
                res.status(200).json({ message: 'Product removed from wishlist' });
            } else {
                // If the item doesn't exist, add it
                const wishlistItem = new Wishlist({
                    user: userId,
                    product: productId
                });
                await wishlistItem.save();
                res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
            }
        } catch (error) {
            console.error('Error in toggleWishlistItem:', error);
            res.status(500).json({ message: 'Error updating wishlist', error: error.message });
        }
    },

    // Add a product to the wishlist
    addToWishlist: async (req, res) => {
        console.log('Received request body:', req.body);

        try {
            const userId = req.user.id; // Assuming you're using authentication middleware
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const existingItem = await Wishlist.findOne({ user: userId, product: productId });
            if (existingItem) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            const wishlistItem = new Wishlist({
                user: userId,
                product: productId
            });
            await wishlistItem.save();
            res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
        } catch (error) {
            console.error('Error in addToWishlist:', error);
            res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
        }
    },

    // Remove a product from the wishlist
    removeFromWishlist: async (req, res) => {
        try {
            const userId = req.user.id; // Assuming you're using authentication middleware
            const { productId } = req.params;
            const result = await Wishlist.findOneAndDelete({ user: userId, product: productId });
            if (result) {
                res.status(200).json({ message: 'Product removed from wishlist' });
            } else {
                res.status(404).json({ message: 'Product not found in wishlist' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
        }
    },

    // Get user's wishlist
    getUserWishlist: async (req, res) => {
        try {
            const userId = req.user.id; // Assuming you're using authentication middleware
            const wishlist = await Wishlist.find({ user: userId }).populate('product');
            res.status(200).json(wishlist);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
        }
    },

    // Check if a product is in the user's wishlist
    isInWishlist: async (req, res) => {
        try {
            const userId = req.user.id; // Assuming you're using authentication middleware
            const { productId } = req.params;
            const item = await Wishlist.findOne({ user: userId, product: productId });
            res.status(200).json({ isInWishlist: !!item });
        } catch (error) {
            res.status(500).json({ message: 'Error checking wishlist', error: error.message });
        }
    }
};

export default wishlistController;