const express = require('express');
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { 
  addReview, 
  getReviews, 
  deleteReview,
  addReply 
} = require('../controller/review.controller');

// Add review
router.post("/add", protect, addReview);

// Get all reviews of a product
router.get("/:productId", getReviews);

// Delete review
router.delete("/:reviewId", protect, deleteReview);

// Admin reply (optional)
router.post("/reply/:reviewId", protect, addReply);

module.exports = router;
