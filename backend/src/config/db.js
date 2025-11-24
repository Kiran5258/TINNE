const mongoose=require('mongoose');

const connectDb=async()=>{
    try{
        const connnect=await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoose is connected");
    }
    catch(err){
        console.error("Mongodb connecting error",err.message);
    }
}

module.exports=connectDb;