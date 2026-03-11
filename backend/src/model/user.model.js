const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const addressSchema = require('./address.model');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:false,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    addresses: [addressSchema],
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
