const express=require('express');
const { Register, Login, checkAuth, updateProfile, Logout, googleLogin, verifyOTP, resendOTP } = require('../controller/user.controller');

const {protect}=require('../middleware/auth.middleware');

const router=express.Router();

router.post("/register",Register);

router.post("/login",Login);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.get("/checkauth",protect,checkAuth);

router.put("/update-profile",protect,updateProfile);

router.post("/logout",Logout);

module.exports=router;