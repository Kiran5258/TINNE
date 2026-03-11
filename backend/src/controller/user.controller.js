const generateToken = require("../config/util");
const User = require("../model/user.model");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      user = await User.create({
        fullName: name,
        email,
        googleId: sub,
      });
    } else if (!user.googleId) {
      // Link account if user exists but first time using Google
      user.googleId = sub;
      await user.save();
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
    if (!fullName || !email || !password || !phoneNo ||!addresses) {
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

    // 🟢 Force first address to be primary
    addresses[0].isPrimary = true;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      phoneNo,
      addresses,
    });

    return res.status(201).json({
      success: true,
      message: "Register success",
      user,
      token: generateToken(user._id, res),
    });
  } catch (err) {
    next(err);
  }
};


exports.Login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
            const error=new Error("All field required");
            error.statusCode=400;
            return next(error);
        }
        const exisitingUser=await User.findOne({email});
        if(!exisitingUser){
            const error=new Error("User is doesn't exisiting");
            error.statusCode=400
            return next(error); 
        }
        const isMatch=await exisitingUser.comparePassword(password);
        if(!isMatch){
            const error=new Error("Invalid password");
            error.statusCode=400;
            return next(error);
        }
        const token=generateToken(exisitingUser._id,res);
        return res.status(200).json({
            message:"Success",
            user:exisitingUser,
            token,
        })
    }catch(err){
        next(err);
    }
}

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
