const mongoose = require('mongoose');
const commandschema = require('./commands.model');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: String,
    text: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    date: {
        type: String,
        required: true,
    },
    replies: [commandschema],
})

module.exports = mongoose.model("Review", reviewSchema);