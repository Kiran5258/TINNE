const mongoose=require("mongoose");
const { PRODUCT_CATEGORIES } = require("../constants/category.enum");

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price: { type: Number, required: true },
    offerPrice:{
        type:String,
        required:true,
    },
    size:{
        type:[String],
        required:true
    },
    image:{
        type:String,
        required:true,
        default:null,
    },
    category:{
        type:String,
        required:true,
        enum:PRODUCT_CATEGORIES,
    },
    stocks:{
        type:Number,
        required:true,
    },
},{timestamps:true});

module.exports=mongoose.model("Product",productSchema);