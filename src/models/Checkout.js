const mongooose = require("mongoose");
const Schema = mongooose.Schema;

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
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    },
    paymethod: {
        type: Schema.Types.ObjectId,
        ref: "Paymethod"
    },
    status: {
        type: String
    },
}, { timestamps: true });

module.exports = mongooose.model("Checkout", checkoutSchema)