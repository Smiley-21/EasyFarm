const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

//load User Model
const User=require('../models/User');
const passport = require('passport');


module.exports=function(passport)
{
   
    //change
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email,password,done)=>{
            //match user
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    console.log("User Not found with username with " +email)
                    return done(null, false,{message:"This email is not registered"});
                }
    
                //Match Password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err)throw err;
                    
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        console.log("Incorrect Password");
                        return done(null,false,{message:'Password incorrect'});
                    }
                });
            })
            .catch(err=>console.log(err));
        })
    );
    passport.serializeUser( (user,done)=>{
        console.log('serializing user', user);
        done(null,user.id);
    });
    
    passport.deserializeUser( ( id,done)=>{
        User.findById(id,(err,user)=>{
            console.log('deserializing user :', user);
            done(err,user);
        });
    });
    
   
}




