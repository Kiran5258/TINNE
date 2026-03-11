const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middlware");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCODOrder,
  getMyOrders,
  getAllOrders,
  getOrderStats,
  getOrderById,
  getAdminOrderById,
  updateOrderStatus,
  downloadProInvoice,
} = require("../controller/order.controller");

// =====================
// ADMIN ROUTES (TOP)
// =====================
router.get("/orders/stats", protect, isAdmin, getOrderStats);
router.get("/orders/admin/:id", protect, isAdmin, getAdminOrderById);
router.get("/orders", protect, isAdmin, getAllOrders);
router.put("/orders/:id/status", protect, isAdmin, updateOrderStatus);
router.get("/admin/orders/:id/invoice", protect,isAdmin,downloadProInvoice);


// =====================
// USER ROUTES
// =====================
router.get("/orders/my", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);

// =====================
// ORDER CREATION
// =====================
router.post("/orders/razorpay", protect, createRazorpayOrder);
router.post("/orders/razorpay/verify", protect, verifyRazorpayPayment);
router.post("/orders/cod", protect, createCODOrder);

module.exports = router;
