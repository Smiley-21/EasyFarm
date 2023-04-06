
let user = require('./user.schema')
let mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { json } = require('body-parser');


// mongoose.connect(config.cloudurl, { useNewUrlParser: true,useUnifiedTopology:true }).then(
//     () => {
//         console.log('started to log auth')
//     }).catch(err => console.log('could not connect to mongo', err));


exports.login =  async(req, res) => {

   
    try{

        const{ username,password,userType}=req.body;

        if (!username || !password || !userType) {
          
        //    res.status(400).json({ msg: "Enter required details" });
        res.redirect('/failed');
           return;
    
        }

       const userObj=await user.User.findOne({username:username,type:userType,password:password}); 
        if (!userObj) {
            //  res.status(400).json({ msg: "Login Failed : Enter Correct username and password" });
            res.redirect('/failed');
           return;
        }
        else {
            req.session.user = userObj
            // res.status(200).json({message:"Login Successful"});
            console.log(userObj);
            req.session.username=userObj.username;
            res.redirect("/machineryPosts")
        }
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Internal Server error"});
    }
}
