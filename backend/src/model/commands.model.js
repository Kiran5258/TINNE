const mongoose=require('mongoose');

const commandschema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=commandschema;