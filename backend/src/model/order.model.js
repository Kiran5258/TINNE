const mongoose = require("mongoose");
const orderItemSchema = require("./orderItem.model");

const {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  ORDER_STATUS,
} = require("../constants/order.enum");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ORDER_STATUS,
      default: "pending",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address1: { type: String, required: true },
      address2: String,
      state: { type: String, required: true },
      district: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
