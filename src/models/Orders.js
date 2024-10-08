import mongoose from "mongoose";
import { Schema } from "mongoose";

const itemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        ref: 'Product',
        required: true
    }
});

// Updated orderSchema to accept shippingAddress and paymentMethod as objects
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [itemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    shippingAddress: {
        // Define as an object schema instead of a string
        type: new Schema({
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true }
        }),
        required: true
    },
    paymentMethod: {
        // Define as an object schema instead of a string
        type: new Schema({
            type: { type: String, required: true },
            details: { type: String, required: true }
        }),
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;

