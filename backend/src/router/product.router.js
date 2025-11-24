const express=require('express');
const router=express.Router();
const { createProduct, updateProduct, deleteProduct, getProducts, getProductById, searchproduct } = require('../controller/product.controller');
const { isAdmin } = require('../middleware/admin.middlware');
const {protect}=require("../middleware/auth.middleware");

//Admin routes
router.post("/createproduct",protect,isAdmin,createProduct);

router.put("/:id",protect,isAdmin,updateProduct);

router.delete("/:id",protect,isAdmin,deleteProduct);

//Public routes
router.get("/showproducts",getProducts);
router.get("/showproduct/:id",getProductById);
router.get("/search",searchproduct);

module.exports=router;