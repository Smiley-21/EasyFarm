const mongoose = require("mongoose");

exports.Machine = mongoose.model("machine-post", {
  title: String,
  description: String,
  rent: mongoose.Types.Decimal128,
  image:{
    createdAt:{
      type:Date,
      default:Date.now,
    },
    name:{
      type:String,
      required:[true,"Uploaded file must have a name"],
    },
  },
  year: String,
  name: String,
  user_name: String,
  owner: String,
  address: String,
  image_machine: Buffer,
  phone: String,
});

// image: { name: String, contentType: String },
