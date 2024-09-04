import mongoose from "mongoose";
import { Schema } from "mongoose";

const payMethodSchema = new Schema({
    type: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
        required: true,
    },
    description: {
        type: String,
        maxlength: 255
    },
    cardNumber: {
        type: String,
        // ใช้เฉพาะเมื่อ type เป็น 'Credit Card'
        // คุณอาจต้องใช้ custom validation ที่ซับซ้อนกว่านี้ในกรณีจริง
        validate: {
            validator: function (value) {
                return this.type === 'Credit Card' ? /^[0-9]{13,19}$/.test(value) : true;
            },
            message: 'Invalid card number format'
        }
    },
    expiryDate: {
        type: Date,
        // ใช้เฉพาะเมื่อ type เป็น 'Credit Card'
        validate: {
            validator: function (value) {
                return this.type === 'Credit Card' ? value > new Date() : true;
            },
            message: 'Expiry date must be in the future'
        }
    },
    billingAddress: {
        type: String,
        // ใช้เฉพาะเมื่อ type เป็น 'Credit Card'
        validate: {
            validator: function (value) {
                return this.type === 'Credit Card' ? value.length > 0 : true;
            },
            message: 'Billing address is required for credit card payments'
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Paymethod", payMethodSchema);
