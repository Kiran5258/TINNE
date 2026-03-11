const crypto = require("crypto");
const Order = require("../model/order.model");
const Product = require("../model/product.model");
const razorpay = require("../config/razorpay");
const { sendOrderEmail } = require("../utils/sendOrderEmail");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
// =====================================
// 1) CREATE RAZORPAY ORDER + DB ORDER
// =====================================
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    const user = req.user;

    if (!items || !items.length) {
      return next({ statusCode: 400, message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, sizeLabel, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return next({ statusCode: 404, message: "Product not found" });
      }

      const sizeObj = product.sizes.find((s) => s.label === sizeLabel);
      if (!sizeObj || sizeObj.stock < quantity) {
        return next({ statusCode: 400, message: "Insufficient stock" });
      }

      const discount = product.offerPrice || 0;
      const price = product.price - (product.price * discount / 100);
      const subtotal = price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.productName,
        sizeLabel,
        quantity,
        price,
        subtotal,
      });
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in DB
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "pending",
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress,
    });

    res.status(201).json({
      message: "Razorpay order created",
      razorpayOrder,
      orderId: order._id,
    });

  } catch (err) {
    next(err);
  }
};


// =======================================================
// 2) VERIFY RAZORPAY PAYMENT
// =======================================================
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    console.log(" HIT /verify-razorpay-payment with body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected sig:", expectedSignature);
    console.log("Got sig     :", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log(" Signature mismatch");
      return next({ statusCode: 400, message: "Invalid payment signature" });
    }

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName email phoneNo"
    );

    if (!order) {
      console.log(" Order not found:", orderId);
      return next({ statusCode: 404, message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    console.log(" Order updated, sending email to:", order.user.email);

    try {
      await sendOrderEmail(order.user, order);
      console.log(" Email sent successfully");
    } catch (emailErr) {
      console.error(" Email send failed:", emailErr);
      // don't break the response just because email failed
    }

    res.json({
      message: "Payment verified and order confirmed",
      order,
    });
  } catch (err) {
    console.error("❌ Error in verifyRazorpayPayment:", err);
    next(err);
  }
};

// =====================================
// 3) CREATE COD ORDER
// =====================================
exports.createCODOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    const user = req.user;

    if (!items || !items.length) {
      return next({ statusCode: 400, message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, sizeLabel, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) return next({ statusCode: 404, message: "Product not found" });

      const sizeObj = product.sizes.find((s) => s.label === sizeLabel);
      if (!sizeObj || sizeObj.stock < quantity) {
        return next({ statusCode: 400, message: "Insufficient stock" });
      }

      const discount = product.offerPrice || 0;
      const price = product.price - (product.price * discount / 100);
      const subtotal = price * quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.productName,
        sizeLabel,
        quantity,
        price,
        subtotal,
      });
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "confirmed",
      totalAmount,
      shippingAddress,
    });

    // reduce stock immediately
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const sizeObj = product.sizes.find((s) => s.label === item.sizeLabel);
      if (sizeObj) sizeObj.stock = Math.max(0, sizeObj.stock - item.quantity);
      await product.save();
    }

    const populatedOrder = await order.populate("user", "fullName email phoneNo");

    // send email ✔ FIXED
    await sendOrderEmail(populatedOrder.user, populatedOrder);

    res.status(201).json({
      message: "COD order created successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

// =====================================
// 4) USER ORDER HISTORY
// =====================================
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "fullName email phoneNo")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// =====================================
// 5) ADMIN ALL ORDERS
// =====================================
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email phoneNo")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// =====================================
// 6) ADMIN STATS (REVENUE, COUNTS)
// =====================================
exports.getOrderStats = async (req, res, next) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: "paid" });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = await Order.countDocuments();
    const codPending = await Order.countDocuments({
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    const monthlyAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      codPending,
      monthly: monthlyAgg,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "fullName email phoneNo");

    if (!order) return next({ statusCode: 404, message: "Order not found" });

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName email phoneNo");

    if (!order) {
      return next({
        statusCode: 404,
        message: "Order not found",
      });
    }

    res.json({ order });

  } catch (error) {
    next(error);
  }
};
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return next({ statusCode: 400, message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next({ statusCode: 404, message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    next(err);
  }
};


exports.downloadProInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const invoiceNo = `TN-${order._id.toString().slice(-6).toUpperCase()}`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoiceNo}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    /* ================= HEADER ================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("TINNE TREATS", { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("gray")
      .text("From Grandma’s Thinnai", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(9)
      .text(
        "1/227A, Union School Street, Padalur, Perambalur – 621117\n" +
        "Phone: +91 7639999740 | Email: tinnetreats@gmail.com | www.tinne.in",
        { align: "center" }
      );

    doc.moveDown(2);
    doc.fillColor("black");

    /* ================= INVOICE META TABLE ================= */
    const invoiceY = doc.y + 10;
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-GB'); // DD/MM/YYYY

    // Draw Outer Box
    doc.rect(50, invoiceY, 500, 50).stroke();
    // Horizontal Line
    doc.moveTo(50, invoiceY + 25).lineTo(550, invoiceY + 25).stroke();
    // Vertical Line (Middle)
    doc.moveTo(300, invoiceY).lineTo(300, invoiceY + 50).stroke();
    // Vertical Line (Label-Value split - Left)
    doc.moveTo(150, invoiceY).lineTo(150, invoiceY + 50).stroke();
    // Vertical Line (Label-Value split - Right)
    doc.moveTo(420, invoiceY).lineTo(420, invoiceY + 50).stroke();

    doc.font("Helvetica").fontSize(10);

    // Row 1
    const row1Y = invoiceY + 8;
    doc.fillColor("black").font("Helvetica-Bold");
    doc.text("Invoice No:", 60, row1Y);
    doc.text(invoiceNo, 160, row1Y);
    doc.text("Invoice Date:", 310, row1Y);
    doc.text(invoiceDate, 430, row1Y);

    // Row 2
    const row2Y = invoiceY + 33;
    doc.text("Order ID:", 60, row2Y);
    doc.text(`ORD-${invoiceNo.slice(-6)}`, 160, row2Y);
    doc.text("Payment Method:", 310, row2Y);
    doc.text(order.paymentMethod || "Online", 430, row2Y);

    doc.moveDown(4);

    /* ================= BILLING TABLE ================= */
    const billingY = doc.y;
    const a = order.shippingAddress || {};
    const name = a.fullName || order.user?.fullName || "Customer";
    const phone = a.phone || order.user?.phone || order.user?.phoneNo || "";
    const address = `${a.address1 || ""}, ${a.address2 ? a.address2 + ", " : ""}${a.district || ""}, ${a.state || ""} - ${a.pincode || ""}`;

    // Header Box
    doc.rect(50, billingY, 500, 25).fill("#f4f4f4").stroke();
    doc.fillColor("black").font("Helvetica-Bold").fontSize(11).text("Bill To", 60, billingY + 7);

    // Content Box
    doc.rect(50, billingY + 25, 500, 65).stroke();
    doc.font("Helvetica").fontSize(10);

    const contentY = billingY + 35;
    const labelX = 60;
    const valueX = 140;

    // Labels
    doc.font("Helvetica-Bold");
    doc.text("Name:", labelX, contentY);
    doc.text("Phone:", labelX, contentY + 15);
    doc.text("Address:", labelX, contentY + 30);

    // Values
    doc.font("Helvetica");
    doc.text(name, valueX, contentY);
    doc.text(phone, valueX, contentY + 15);
    doc.text(address, valueX, contentY + 30, { width: 400 });

    doc.moveDown(5); // Space before items table

    /* ================= ITEMS TABLE HEADER ================= */
    const tableTop = doc.y;

    // Header Background
    doc.rect(50, tableTop, 500, 20).fill("#e0e0e0").stroke();

    doc.fillColor("black").font("Helvetica-Bold");
    doc.text("Sl.No", 60, tableTop + 5);
    doc.text("Product Name", 110, tableTop + 5);
    doc.text("Qty", 320, tableTop + 5);
    doc.text("Unit Price", 380, tableTop + 5);
    doc.text("Total", 480, tableTop + 5);

    // Reset Color
    doc.fillColor("black");

    /* ================= ITEMS TABLE BODY ================= */
    doc.font("Helvetica");
    let y = tableTop + 25;

    // Calculate subtotal
    let calculatedSubtotal = 0;

    order.items.forEach((item, i) => {
      const pName = item.product?.productName || item.productName || "Item";
      const pPrice = item.price || 0;
      const pQty = item.quantity || 1;
      const pTotal = item.subtotal || (pPrice * pQty);

      calculatedSubtotal += pTotal;

      // Ensure text fits or truncates safely
      doc.text(i + 1, 60, y);
      doc.text(pName, 110, y, { width: 180, height: 20, ellipsis: true });
      doc.text(pQty.toString(), 320, y);
      doc.text(pPrice.toFixed(2), 380, y);
      doc.text(pTotal.toFixed(2), 480, y);

      // Horizontal line below each item
      doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor("#cccccc").stroke().strokeColor("black");

      y += 25;
    });

    // Outer border for table items
    doc.rect(50, tableTop + 20, 500, y - (tableTop + 20)).stroke();

    /* ================= SUMMARY TABLE ================= */
    const shippingCharge = order.shippingCharge || 0;
    const finalSubtotal = order.subtotalAmount || calculatedSubtotal;
    const finalTotal = order.totalAmount || (finalSubtotal + shippingCharge);

    y += 20; // Space after items table

    const summaryX = 300;
    const summaryWidth = 250;
    const rowHeight = 25;

    // Subtotal Row
    doc.rect(summaryX, y, summaryWidth, rowHeight).stroke();
    doc.text("Subtotal", summaryX + 10, y + 7);
    doc.text(finalSubtotal.toFixed(2), summaryX + 150, y + 7, { align: "right", width: 90 });

    // Shipping Row
    y += rowHeight;
    doc.rect(summaryX, y, summaryWidth, rowHeight).stroke();
    doc.text("Shipping", summaryX + 10, y + 7);
    doc.text(shippingCharge.toFixed(2), summaryX + 150, y + 7, { align: "right", width: 90 });

    // Grand Total Row
    y += rowHeight;
    doc.rect(summaryX, y, summaryWidth, rowHeight).stroke();
    doc.font("Helvetica-Bold");
    doc.text("Grand Total", summaryX + 10, y + 7);
    doc.text(finalTotal.toFixed(2), summaryX + 150, y + 7, { align: "right", width: 90 });

    doc.moveDown(4);

    /* ================= FOOTER ================= */
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for shopping with Tinne Treats ❤️", { align: "center" })
      .text("Healthy • Traditional • Pure", { align: "center" });

    doc.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Invoice generation failed" });
    }
  }
};

