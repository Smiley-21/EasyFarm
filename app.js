require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const app=express();
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const passport=require('passport');
const flash=require('connect-flash');
const session=require('express-session');


//passport config
require('./config/passport')(passport);

//db config
const db =require('./config/keys').MongoURI;


// app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));


//Express Session
app.use(session({
    secret:'Thisisourlittlesecret',
    resave:true,
    saveUninitialized:true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// connecting with mongoDB
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));






//connect falsh
app.use(flash());

//global vars
app.use( (req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});
//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT= process.env.PORT ||3000;
app.listen(PORT, function(req,res)
{
    console.log('Successfully started Server !!');
});