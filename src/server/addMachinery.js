
const machine = require("./machinery.schema");
const mongoose = require("mongoose");
const multer = require("multer");
const fs=require('fs');


exports.create = async(req, res) => {
  try{
    console.log("creating a new machine");

  // console.log("Name of file " + typeof req.file.filename === 'object' ? req.file.filename.toString() : req.file.filename);
  const newmachine=await machine.Machine({
    name:req.file.filename,
    title: req.body.title,
    description: req.body.description,
    rent: req.body.rent,
    image: {
      name:req.file.filename,
      // contentType:'image/png'
    },
    year: req.body.year,
    name: req.body.name,
    user_name: req.body.username,
    owner: req.body.owner,
    address: req.body.address,
    phone: req.body.phone,
  })

  newmachine.save().then(() => res.redirect("/machine"));
 
  }catch(error)
 {
  res.json({error});
 }
};

exports.edit = (req, res) => {
  console.log("_id : ", req.body.id);
  console.log("Edit Post:(Title) ", req.body.title);

  machine.Machine.findById(req.body.id, (err, result) => {
    if (err) {
      console.log("error fetching the post ", err);
    } else {
      result.title = req.body.title;
      result.description = req.body.description;
      result.rent = req.body.rent;
      result.image = req.body.image;
      res.send(result);
    }
  });
};

exports.showPost = async(req, res) => {
  // console.log("Params ID : ", req.params.id); 

 await machine.Machine.findById(req.params.id, (err, result) => {
    if (err) {
      console.log("error fetching the post ", err);
    } else {
      // console.log(" result ", result);
      // console.log(result.image.buffer);
      req.session.postData = result;
      req.session.postType = "Machinery";
      res.render("detailed-post-machine.ejs", { 
        postData: result, 
        whatsapp:"https://wa.me/+91"+result.phone,
        imageurl:result.image.name,
     
    });
    console.log(result);
    }
  });
};
