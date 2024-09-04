import mongoose from "mongoose";
import { Schema } from "mongoose";

const ReviweSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true

    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    Comment: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Review", ReviweSchema);