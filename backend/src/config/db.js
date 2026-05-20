const mongoose=require('mongoose');
const User = require('../model/user.model');

const connectDb=async()=>{
    try{
        const connnect=await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoose is connected");
        
        // Mark existing users as verified if the field is missing
        await User.updateMany({ isVerified: { $exists: false } }, { $set: { isVerified: true } });
        console.log("Database user migration completed.");
    }
    catch(err){
        console.error("Mongodb connecting error",err.message);
    }
}

module.exports=connectDb;