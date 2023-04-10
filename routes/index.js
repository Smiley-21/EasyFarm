const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const contactUs = require('../models/contactUs');
const nodemailer=require('nodemailer');


const transporter=nodemailer.createTransport({
    service:'gmail',
    secure:false,

    auth:{
        user:process.env.user_sender,
        pass:process.env.pass
    }
});

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name
    })
})
//change route

module.exports=function(passport){
    router.post('/login',)
}

//change route
router.get('/home',(req,res)=>{
    res.render('index');
});

router.post('home',(req,res)=>{
    res.redirect('/');
});

router.get('/about',(req,res)=>{
    res.render('about');
});

router.get('/service', (req,res)=>
{
    res.render('service');
});

router.get('/contact', (req,res)=>{
    res.render('contact');
});

router.get('/policy', (req,res)=>{
    res.render('policy');
});

router.get('/review',(req,res)=>{
    res.render('Review');
});

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/vinodkumar', (req,res)=>{
    res.render('vinodkumar');
});

router.get('/rameshsingh',(req,res)=>{
    res.render('rameshsingh');
});

router.get('/mohanbhati',(req,res)=>{
    res.render('mohanbhati');
});

router.get('/anilbhati', (req,res)=>{
    res.render('anilbhati');
});

router.get('/ramlal', (req,res)=>{
    res.render('ramlal');
});

router.get('/vikramchaudhary',(req,res)=>{
    res.render('vikramChaudhary');
});


router.post('/submitcontact', (req,res)=>{
    console.log("Form is submitted and will contact very soon");

    const contactUsdata=new contactUs({
        name:req.body.name,
        phone:req.body.phone,
        emailAddress:req.body.email,
        message:req.body.message,
    })

   
    console.log(req.body);

   

    
    const email=req.body.email;
    const phone=req.body.phone;

    const mailOptions={
        from:process.env.user_sender,
        to:process.env.user_receiver,
        subject:`Query from ${email} Phone :${phone}`,
        text:req.body.message,
    }

    transporter.sendMail(mailOptions,(err,data)=>{
        if(err)
        console.log(err);
        else
        console.log("Email sent successfully");
    })

    contactUsdata.save( (err,savedContactUs)=>{
        if(err)
        {
            console.log(err);
            res.sendStatus(500);
        }
        else
        res.render('submitcontact');

    })
})

router.post('/newsletter', (req,res)=>{
    // console.log("Newsletter subscribed");
    console.log(req.body.Email);
    
    res.render('newsletterconfirm');
})


module.exports=router;

