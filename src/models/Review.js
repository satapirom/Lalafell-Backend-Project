import mongoose from "mongoose";
import { Schema } from "mongoose";

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {  // Make sure this field is named 'comment'
        type: String,
        required: true
    }
}, { timestamps: true });

ReviewSchema.index({ user: 1, product: 1 });

export default mongoose.model("Review", ReviewSchema);
