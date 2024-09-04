import Checkout from "../models/Checkout.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import Address from "../models/Address.js";
import Paymethod from "../models/PaymentMethod.js";

// Create a checkout
const createCheckout = async (req, res) => {
    const { user, items, totalAmount, address, paymethod, status } = req.body;

    try {
        // Validate if user, address, and payment method exist
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        const addressExists = await Address.findById(address);
        if (!addressExists) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        const paymethodExists = await Paymethod.findById(paymethod);
        if (!paymethodExists) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        // Validate if all products exist
        for (const item of items) {
            const productExists = await Product.findById(item.product);
            if (!productExists) {
                return res.status(404).json({ error: true, message: `Product with ID ${item.product} not found` });
            }
        }

        // Create a new checkout
        const newCheckout = new Checkout({
            user,
            items,
            totalAmount,
            address,
            paymethod,
            status
        });
        const savedCheckout = await newCheckout.save();

        return res.
            status(201).
            json({ error: false, message: "Checkout created successfully", data: savedCheckout });

    } catch (error) {
        console.error(`Error creating checkout: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get all checkouts
const getCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find().populate('user').populate('items.product').populate('address').populate('paymethod');
        return res.json({ error: false, checkouts });
    } catch (error) {
        console.error(`Error getting checkouts: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get a checkout by ID
const getCheckoutById = async (req, res) => {
    const { checkoutId } = req.params;

    try {
        const checkout = await Checkout.findById(checkoutId).populate('user').populate('items.product').populate('address').populate('paymethod');
        if (!checkout) {
            return res.status(404).json({ error: true, message: "Checkout not found" });
        }
        return res.json({ error: false, checkout });
    } catch (error) {
        console.error(`Error getting checkout: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Update a checkout
const updateCheckout = async (req, res) => {
    const { checkoutId } = req.params;
    const { items, totalAmount, address, paymethod, status } = req.body;

    try {
        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
            return res.status(404).json({ error: true, message: "Checkout not found" });
        }

        // Update checkout details
        if (items) checkout.items = items;
        if (totalAmount) checkout.totalAmount = totalAmount;
        if (address) checkout.address = address;
        if (paymethod) checkout.paymethod = paymethod;
        if (status) checkout.status = status;

        const updatedCheckout = await checkout.save();
        return res.json({ error: false, message: "Checkout updated successfully", data: updatedCheckout });
    } catch (error) {
        console.error(`Error updating checkout: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Delete a checkout
const deleteCheckout = async (req, res) => {
    const { checkoutId } = req.params;

    try {
        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
            return res.status(404).json({ error: true, message: "Checkout not found" });
        }

        await Checkout.deleteOne({ _id: checkoutId });
        return res.json({ error: false, message: "Checkout deleted successfully" });
    } catch (error) {
        console.error(`Error deleting checkout: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const checkoutController = {
    createCheckout,
    getCheckouts,
    getCheckoutById,
    updateCheckout,
    deleteCheckout
};

export default checkoutController;
