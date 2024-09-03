const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products"
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    ],
    totalAmount: {
        type: Number
    },
    status: {
        type: String
    },
    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    },
    paymentMethod: {
        type: Schema.Types.ObjectId,
        ref: "Paymethod"
    }
}, { timestamps: true });

module.exports = mongoose.model("Orders", OrderSchema);