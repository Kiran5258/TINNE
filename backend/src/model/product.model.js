const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES } = require("../constants/category.enum");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },

    // offer price = discount %
    offerPrice: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
    },

    sizes: [
        {
            label: { type: String, required: true }, // e.g., "500g"
            stock: { type: Number, required: true },  // e.g., 10
            price: { type: Number, required: true }   // e.g., 100
        }
    ],

    images: [{
        type: String,
        required: true,
    }],

    category: {
        type: String,
        required: true,
        enum: PRODUCT_CATEGORIES,
    },

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
