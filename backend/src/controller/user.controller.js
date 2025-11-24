const generateToken = require("../config/util");
const User = require("../model/user.model");

exports.Register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, address } = req.body;

    if (!firstName || !lastName || !email || !password || !address) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.create({ firstName, lastName, email, password, address });

    return res.status(201).json({
      success: true,
      message: "Register success",
      user,
      token:generateToken(user._id,res)
    });

  } catch (err) {
    next(err);  // automatically sends to error middleware
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

exports.Logout=async(req,res,next)=>{
  try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logout successfully"});
  }
  catch(err){
    next(err);
  }
}

exports.checkAuth=(req,res,next)=>{
  try{
    res.status(200).json(req.user);
  }
  catch(err){
    next(err);
  }
}

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
