import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    avatar:{type:String,required:true},
    allProperties:[{type:mongoose.Schema.Types.ObjectId, ref:'Property'}] //One User can create Many Property
});

const User=mongoose.model('User',userSchema);

export default User;