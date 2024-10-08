import mongoose from "mongoose";
import { Schema } from "mongoose";

const addressSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10

    },
    street: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);