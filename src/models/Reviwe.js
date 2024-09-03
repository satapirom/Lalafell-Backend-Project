const mongooose = require("mongoose");
const Schema = mongooose.Schema;

const ReviweSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    products: {
        type: Schema.Types.ObjectId
    },
    rating: {
        type: Number
    },
    Comment: {
        type: String
    }
}, { timestamps: true });

module.exports = mongooose.model("Reviwe", ReviweSchema)