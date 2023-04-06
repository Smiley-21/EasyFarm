const path = require("path");
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nodemailer=require("nodemailer");
const dotenv=require('dotenv');

dotenv.config();

var session = require("express-session");
const mongoose = require("mongoose");

mongoose.connect(
    process.env.cloudurl,
    { useNewUrlParser: true ,useUnifiedTopology:true}
  )
  .then(() => console.log("MongodDb Connected Successfully"))
  .catch(err=>console.log("Error in connecting to MongoDB ",err));


const machineryController = require("./server/addMachinery");
const landController = require("./server/addLand");
const searchLandPosts = require("./server/searchLandPosts");
const searchMachinePosts = require("./server/searchMachinePosts");
const accountinfo = require("./server/accountInfo");
const sendMsg = require("./server/sendsms");
const getMsg = require("./server/getAllMessages");
const { url } = require("inspector");
const auth = require("./server/auth");
const searchAll = require("./server/searchAll");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(logger("dev"));

app.use(
  session({
    user: null,
    secret: "farmkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, resp) => {
  resp.render("home.ejs");
});

app.get("/land", urlencodedParser, searchLandPosts.getAllPosts);

app.get("/machine", urlencodedParser, searchMachinePosts.getAllPosts);
// const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// app.get('/machine', ensureLoggedIn('/login'), urlencodedParser, searchMachinePosts.getAllPosts);


app.get("/getAllMessages", urlencodedParser, getMsg.getAllMessages);

app.get("/addAsset", (req, resp) => {
  resp.render("add-asset-form.ejs");
});

app.get("/profile/:username", (req, res) => {
  res.send(req.params.username);
});

app.get("/getAllMessages", urlencodedParser, getMsg.getAllMessages);


app.post("/addMachine", urlencodedParser, machineryController.create);

app.post("/addLand", urlencodedParser, landController.create);

app.get("/land/:id", urlencodedParser, landController.showPost);
app.post("/land/update", urlencodedParser, landController.edit);

app.get("/machine/:id", urlencodedParser, machineryController.showPost);
app.post("/machine/update", urlencodedParser, landController.edit);

app.post("/searchLandPosts", urlencodedParser, searchLandPosts.getPosts);
app.post("/searchMachinePosts", urlencodedParser, searchMachinePosts.getPosts);
app.get("/success", urlencodedParser, (req, res) => {
  res.render("success.ejs");
});
app.get("/cancel", urlencodedParser, (req, res) => {
  res.render("Oncancel.ejs");
});
app.post("/search", urlencodedParser, searchLandPosts.getPosts);
app.get("/account-info", urlencodedParser, accountinfo.showinfo);
app.post("/edit-account-info", urlencodedParser, accountinfo.edit);

app.post("/usercreate", urlencodedParser, accountinfo.create);

app.post("/account-info-edit", urlencodedParser, accountinfo.editinfo);

app.get("/landPosts", urlencodedParser, searchLandPosts.getAllPosts);
app.get("/machineryPosts", urlencodedParser, searchMachinePosts.getAllPosts);

app.get("/login", (req, resp) => {
  console.log(req.session.user);
  if (!req.session.user) {
    resp.render("login.ejs");
  } else {
    resp.redirect("/");
  }
});

app.get("/signUp", (req, resp) => {
  resp.render("sign-up.ejs");
});

const client = require("twilio")(
  "AC98b8ec28dd24a88aa5ad77ed76edff47",
  "6d564b2e2b0f510133eb8020a9f50c82"
);

app.get("/notification", urlencodedParser, (req, res) => {
  client.messages
    .list({ limit: 20 })
    .then((messages) => res.render("notification.ejs", { data: messages }));
});


const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.user_sender,
    pass:process.env.pass
  }
});

app.get("/payment", urlencodedParser, (req, res) => {
  // console.log(req.session.postData);
  console.log(req.session);
 
  const postData=req.session.postData;

  const user_signed=req.session.postData.user_name;
  // console.log(user_signed);
    const mailDetails={
    from:process.env.user_sender,
    to:process.env.receiver,
    subject:"Booking Confirmation ",
    html: `<h1>Booking Details</h1>

      <style>
      .detailText{
        margin-left: 20px;
        color:#F14B28 ;
        font-weight: bold;
        font-size: 20px;
      }
      </style>
                      <div class="postDetailsContainer">
                        <label>
                            <h4>Details of Machine</h4>
                        </label>
                        <div>
                            <label> Machine Name:</label> <span class="detailText"> ${ postData.title}  </span>
                        </div>
                        <ol>
                        <li><label>Model Year:</label><span class="detailText">${ postData.year }</span></br></li>
                        <li><label>Model Name:</label><span class="detailText">${ postData.name }</span></br></li>
                        <li><label>Price:</label><span class="detailText">${ postData.rent.$numberDecimal }</span></br></li>
                       <li> <label>Owner:</label><span class="detailText">${ postData.owner }</span></br></li>
                       <li> <label>Address:</label><span class="detailText">${ postData.address }</span></br></li>
                        <li><label>Phone:</label><span class="detailText">${ postData.phone }</span></br></li>
                        </ol>

                        <label>Description:</label><span
                            class="detailText descriptionText">${postData.description }</span></br>
                    </div>
    
    `,

    
  }

  transporter.sendMail(mailDetails,(err,data)=>{
    if(err)
    console.log(err);
    else
    console.log("Email Sent Successfully");
  })


  res.render("bookingconfirm.ejs", {
    postData: req.session.postData,
    postType: req.session.postType,
  });
});

app.get("/directchat", urlencodedParser, getMsg.getAllMessages);

app.post("/searchAll", urlencodedParser, searchAll.getAllPosts);
app.get("/logout", urlencodedParser, (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

app.get("/failed", urlencodedParser,(req,res)=>{
  res.render("failed.ejs");
})

app.post("/login", urlencodedParser,auth.login);


//Booking Confirmation and post sending of mail to service provider


// app.post("/bookingconfirm",urlencodedParser,(req,res)=>{

//   console.log(req.session.postData);
//   const mailDetails={
//     from:process.env.user_sender,
//     to:process.env.receiver,
//     subject:"Booking Confirmation ",

    
//   }

//   transporter.sendMail(mailDetails,(err,data)=>{
//     if(err)
//     console.log(err);
//     else
//     console.log("Email Sent Successfully");
//   })

//   res.render('bookingconfirm.ejs');
// })

app.use(logger("dev"));
const port=3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
