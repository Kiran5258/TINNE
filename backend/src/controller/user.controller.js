const generateToken = require("../config/util");
const User = require("../model/user.model");
const { sendWelcomeEmail } = require("../utils/sendWelcomeEmail");
const { sendOTPEmail } = require("../utils/sendOTPEmail");
const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "ttinne-fb88d"
  });
}

const jwt = require("jsonwebtoken");

exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(tokenId);
    } catch (verifyErr) {
      console.error("\n=== Firebase ID Token Verification Error ===");
      console.error("Error Details:", verifyErr.message);
      console.error("============================================\n");

      const error = new Error(
        `Firebase token verification failed: ${verifyErr.message}`
      );
      error.statusCode = 400;
      return next(error);
    }
    
    const { uid, email, name } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        googleId: uid,
        isVerified: true, // Google/Firebase email is already verified
      });
      await sendWelcomeEmail(user);
    } else {
      // Auto-verify user and link Google ID if not present
      let modified = false;
      if (!user.googleId) {
        user.googleId = uid;
        modified = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

    const token = generateToken(user._id, res);
    res.status(200).json({
      message: "Success",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.Register = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNo, addresses } = req.body;

    // Validate fields
    if (!fullName || !email || !password || !phoneNo || !addresses) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if addresses array is empty
    if (!Array.isArray(addresses) || addresses.length === 0) {
      const error = new Error("At least one address is required");
      error.statusCode = 400;
      return next(error);
    }

    // Force first address to be primary
    addresses[0].isPrimary = true;

    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        return next(error);
      } else {
        // Update user registration details if not verified yet
        user.fullName = fullName;
        user.password = password; // hashed in pre-save hook
        user.phoneNo = phoneNo;
        user.addresses = addresses;
      }
    } else {
      // Create user (unverified by default)
      user = new User({
        fullName,
        email,
        password,
        phoneNo,
        addresses,
        isVerified: false,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    await sendOTPEmail(user.email, user.fullName, otp);

    return res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify.",
      requiresVerification: true,
      email: email,
    });
  } catch (err) {
    next(err);
  }
};

exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            return next(error);
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found");
            const error = new Error("Invalid email or password");
            error.statusCode = 400;
            return next(error);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Login failed: Password mismatch");
            const error = new Error("Invalid email or password");
            error.statusCode = 400;
            return next(error);
        }

        // Check if user email is verified
        if (!user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000;
            await user.save();
            await sendOTPEmail(user.email, user.fullName, otp);

            const error = new Error("Email is not verified. A verification code has been sent to your email.");
            error.statusCode = 403;
            error.requiresVerification = true;
            error.email = email;
            return next(error);
        }

        const token = generateToken(user._id, res);
        return res.status(200).json({
            message: "Success",
            user: user,
            token,
        });
    } catch (err) {
        next(err);
    }
}

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      const error = new Error("Email and OTP are required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.isVerified) {
      const token = generateToken(user._id, res);
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
        user,
        token,
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      const error = new Error("Invalid or expired OTP");
      error.statusCode = 400;
      return next(error);
    }

    // Set user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send Welcome Email
    await sendWelcomeEmail(user);

    const token = generateToken(user._id, res);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.isVerified) {
      const error = new Error("Email is already verified");
      error.statusCode = 400;
      return next(error);
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(user.email, user.fullName, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.Logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

exports.checkAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.status(200).json({
    user: req.user,  
  });
};


// UPDATE PROFILE (User can update name + address)
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { firstName, lastName, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // update fields
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName = lastName;

    if (address) {
      user.address.addressNo = address.addressNo || user.address.addressNo;
      user.address.address = address.address || user.address.address;
      user.address.city = address.city || user.address.city;
      user.address.state = address.state || user.address.state;
      user.address.pinNo = address.pinNo || user.address.pinNo;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    next(err);
  }
};
