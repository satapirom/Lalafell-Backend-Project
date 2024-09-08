import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    inventory: {
        type: Number,
        required: true
    },
    images: [
        {
            public_id: { type: String },
            url: { type: String }
        }
    ],
    // addedBy: { type: String },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);