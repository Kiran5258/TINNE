const express=require('express');
const { Register, Login, checkAuth, updateProfile, Logout } = require('../controller/user.controller');

const {protect}=require('../middleware/auth.middleware');

const router=express.Router();

router.post("/register",Register);

router.post("/login",Login);

router.get("/checkauth",protect,checkAuth);

router.put("/update-profile",protect,updateProfile);

router.post("/logout",Logout);

module.exports=router;