const mongooose = require("mongoose");
const Schema = mongooose.Schema;

const payMethodSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongooose.model("Paymethod", payMethodSchema);