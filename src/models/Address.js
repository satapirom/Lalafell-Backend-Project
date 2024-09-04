import mongoose from "mongoose";
import { Schema } from "mongoose";

const addressSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    street: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number'],
        maxlength: 10

    },
    isDefault: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);