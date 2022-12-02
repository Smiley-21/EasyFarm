const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');


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


module.exports=router;

