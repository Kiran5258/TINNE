const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        default: "",
    },
    address3: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    }
});

module.exports = addressSchema;
