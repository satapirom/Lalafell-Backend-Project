import mongoose from "mongoose";
import { Schema } from "mongoose";
import crypto from 'crypto';

const payMethodSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['Credit Card', 'PayPal', 'Bank Account'],
            required: true,
        },
        // Fields for Credit Card
        cardNumber: {
            type: String,
        },
        lastFourDigits: {
            type: String,
            validate: {
                validator: function (value) {
                    return this.type === 'Credit Card' ? value.length === 4 : true;
                },
                message: 'Last four digits are required for credit card payments',
            },
        },
        expiryDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return this.type === 'Credit Card' ? value > new Date() : true;
                },
                message: 'Expiry date must be in the future',
            },
        },
        // Fields for Bank Account
        bankName: {
            type: String,
            validate: {
                validator: function (value) {
                    return this.type === 'Bank Account' ? value.length > 0 : true;
                },
                message: 'Bank name is required for bank account payments',
            },
        },
        accountNumber: {
            type: String,
            validate: {
                validator: function (value) {
                    return this.type === 'Bank Account' ? /^[0-9]+$/.test(value) : true;
                },
                message: 'Invalid account number format',
            },
        },
        accountHolderName: {
            type: String,
            validate: {
                validator: function (value) {
                    return this.type === 'Bank Account' ? value.length > 0 : true;
                },
                message: 'Account holder name is required for bank account payments',
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Paymethod", payMethodSchema);
