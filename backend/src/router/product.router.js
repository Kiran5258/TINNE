const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts, 
  getProductById, 
  searchProduct,
  getCategories, 
} = require('../controller/product.controller');

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require('../middleware/admin.middlware');

// =============================
//          ADMIN ROUTES
// =============================
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
// =============================
//          PUBLIC ROUTES
// =============================
router.get("/", getProducts);
router.get("/search", searchProduct);
router.get("/category",getCategories);
router.get("/:id", getProductById);


module.exports = router;
