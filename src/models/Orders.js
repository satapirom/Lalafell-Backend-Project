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
    }
});

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
        type: String,
        ref: 'Address',
        required: true
    },
    paymentMethod: {
        type: String,
        ref: 'Paymethod',
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
