import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    inventory: {
        type: Number,
        required: true
    },
    images: [String],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);