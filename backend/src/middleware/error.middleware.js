module.exports = (err, req, res, next) => {
  console.error(" Global Error:", err.message);

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
    requiresVerification: err.requiresVerification,
    email: err.email,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
