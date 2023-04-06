const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    },
    name:{
        type:String
    },
    phone:{
        type:String
    },
    residence:{
        type:String
    },
    state:{
        type:String
    },
    district:{
        type:String
    },
    village:{
        type:String
    },
    status:{
        type:String
    },
    paymentMode:{
        type:String
    }
})

const Order=mongoose.model("Order",OrderSchema);
module.exports=Order;