const mongoose=require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    sizeLabel: { type: String, required: true }, // e.g. "500g"
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },     // unit price
    subtotal: { type: Number, required: true },  // price * quantity
  },
  { _id: false }
);

module.exports=orderItemSchema;