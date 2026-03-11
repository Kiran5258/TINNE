const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check Cookie "token" (correct name)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token?
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
