const mongooose = require("mongoose");
const Schema = mongooose.Schema;

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
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

module.exports = mongooose.model("Address", addressSchema);