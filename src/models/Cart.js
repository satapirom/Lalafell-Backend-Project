import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    totalQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);