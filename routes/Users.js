const express=require('express');
const router=express.Router();
const passport=require('passport');
const bcrypt=require('bcryptjs');
const jwt=require('jwt-simple');
const bodyparser=require('body-parser');
var nodemailer=require('nodemailer');
// const ensureAuthenticated=require('../config/auth');
// const { findOneAndUpdate } = require('../models/User');


// require('../config/auth'); --change made
//User model
const User=require('../models/User');




var transporter=nodemailer.createTransport({
    service:'gmail',
    auth :{
        user:'saurabhp2131@gmail.com',
        pass:"Patel@#3340"
    }
});

//login page
router.get('/login',(req,res)=>{
    res.render('login');
});
//register page
router.get('/register',(req,res)=>res.render('register'));

//register post
router.post('/register', (req,res)=>{
    const {name,email, password,password2}=req.body;
    let errors=[];
    console.log({
        name,password,email,password2
    });
    //check required fields
    if(!name || !email || !password || !password2)
    {
        errors.push({msg:"Please fill in all fields"});
    }

    //check password match

    if(password!=password2)
    {
        errors.push({msg:'Password do not match'});
    }

    if(password.length<6)
    {
        errors.push({msg:'Password should be atleast 6 characters of length'});

    }
    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else
    {
        //Validation passed
        User.findOne({email:email})
        .then(user=>{
            if(user)
            {
                //Already exists
                console.log( "User already exists "+user.name);
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
             
               
            }

            else
            {
                const newUser=new User({
                    name,
                    email,
                    password
                });

                //hashing of password
                bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err)throw err;

                    //Use hashed password as new password
                    newUser.password=hash;
                   //save user
                   newUser.save().then(user=>{
                    req.flash('success_msg','You are now registered and can log in');
                    res.redirect('/users/login');
                   })
                   .catch(err=>console.log(err));
                }))
                
            }
        });
    }
});

//forgot password 
router.get('/forgotpassword', function(req,res){
    res.render('forgotpassword');
});

//password reset
router.post('/passwordreset', function(req,res){
    res.render('ResetPassword');


    //Validation of email
    if(req.body.email==undefined)
    {
        const emailAddress=req.body.email;
        User.findOne({email:emailAddress})
        .then(user=>{
            if(user)
            {
                var payload={
                    id:user.id,
                    email:user.email
                };


                var secret =user.password+'-'+'1506868106675';
                console.log(secret);
                var token =jwt.encode(payload,secret);

                var mailOptions={
                    from:'saurabhp2131@gmail.com',
                    to:`${payload.email}`,
                    subject:'reset link',
                    html:  '<a href="https://login-validation.herokuapp.com/users/resetpassword/' +payload.id+'/'+ token + '">Reset Password</a>'
                };

                transporter.sendMail(mailOptions, function(error,info){
                    if(error)
                   {
                    console.log(error);
                   }
                    else
                    {
                        console.log('Email sent: '+info.response);
                    }
                })
            }
        })
    }

    else
    {
        res.send("Email address is missing");
    }
});


router.get('/resetpassword/:id/:token', function(req,res)
{

    //Fetch user from database using req.params.id

    User.findOne({_id:req.params.id})
    .then(user=>{
        if(user)
        {
            var secret=user.password+'-'+'1506868106675';
         
            var payload=jwt.decode(req.params.token,secret);
            res.send('<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">'+
            '<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>'+
            ' <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script><style>body{background-image: url("http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg")}'+
             'body{background-size: cover;}'+
             'body{background-repeat: no-repeat;}'+
             'body{height: 100%;}'+
             'body{font-family:"Numans"  sans-serif;}.container{height: 100%;align-content: center;}'+
             '.card{ height: 120px;margin-top: auto;margin-bottom: auto;width: 400px; background-color: rgba(0,0,0,0.5) !important; }'+
             '.login_btn{color: black;background-color: #FFC312;width: 130px;}'+
             'input:focus{outline: 0 0 0 0  !important;box-shadow: 0 0 0 0 !important; }'+
                 '</style><html><body><div class="container">'+
                ' <div class="d-flex justify-content-center h-100">'+
                     '<div class="card">'+
                         '<div class="card-body"><form action="/users/resetpassword" method="POST">' +
         '<input type="hidden"class="form-control" name="id" value="' + payload.id + '" />' +
         '<input type="hidden"class="form-control" name="token" value="' + req.params.token + '" />' +
         '<div class="form-group"><input type="password"class="form-control" name="password" value="" placeholder="Enter your new password..." /></div>' +
         '<div class="form-group"><input type="submit"class="btn float-right login_btn" value="Reset Password" />' +
     '</div></div></div></div></form></body></html>');

        }
    })
});


router.post('/resetpassword', function(req,res)
{
    User.findOneAndUpdate({_id:req.body.id},{$set:{passsword:`${req.body.password}`}},{new:true})
    .then(user=>{
        bcrypt.genSalt(10,function(err,salt)
        {
            bcrypt.hash(user.password,salt,function(err,hash)
            {
                user.password=hash;


                user.save().then(user=>{
                    req.flash('success_msg','Password has been reset Successfully');
                    res.redirect('/users/login');
                });
            })
        })
    })
});

// router.post('/login',
// passport.authenticate('local',
// {
//     failureRedirect:'/users/login',
//     failureFlash:true,

// }),
//     function(req,res)
//     {
//         res.render('dashboard');
//     }

// );

router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});







router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('success_msg', 'session terminated');
      res.redirect("/users/login");
      
    });
  });




module.exports=router;