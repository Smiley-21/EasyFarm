const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
   name:String,
   email:String,
   password:String,
   googleID:String,
   secret:String,
   firstName:String,
   lastName:String,
   Address:String,
   Phone:Number,
   equipmentName:String,
   equipmentNumber:Number,
   date:Date

});

const User=mongoose.model('User', UserSchema);
module.exports=User;