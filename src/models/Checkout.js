import mongoose from "mongoose";
import { Schema } from "mongoose";

const checkoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products"
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
    totalAmount: {
        type: Number,
        required: true,
        min: 1
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    paymethod: {
        type: Schema.Types.ObjectId,
        ref: "Paymethod",
        required: true
    },
    status: {
        type: String,
        enum: ['payment', 'to-ship', 'to-receive', 'completed', 'refund/return', 'cancelled'],
        default: 'payment'
    },
}, { timestamps: true });

export default mongoose.model("Checkout", checkoutSchema);