const mongoose=require('mongoose');

const contactUsSchema=mongoose.Schema({
    name:String,
    phone:String,
    emailAddress:String,
    message:String,
})

const contactUs=mongoose.model("contactUs",contactUsSchema);
module.exports=contactUs