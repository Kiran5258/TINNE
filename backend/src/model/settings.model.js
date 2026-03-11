const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        globalOffer: {
            enabled: {
                type: Boolean,
                default: false,
            },
            percentage: {
                type: Number,
                default: 0,
            },
            promoCode: {
                type: String,
                default: "",
            },
        },
        popup: {
            enabled: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: "",
            },
            message: {
                type: String,
                default: "",
            },
            image: {
                type: String,
                default: "",
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

