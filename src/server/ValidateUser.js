const User=require('./user.schema');
const validateUser = async(req, res, next) => {
    const { email, password } = req.body;
  
    // Check if email and password are present in request body
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
  
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
  
    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
  
    // If validation passes, move to the next middleware
    try{
      const user=await User.findOne({email});
      if(!user)
      {
        return res.status(401).json({message:"Invalid Credentials"});
      }

      const isPasswordValid=await user.comparePassword(password);
      if(!isPasswordValid)
      {
        return res.status(401).json({message:"Invalid Credentials"});
      }

      next();
    }catch(err)
    {
      return res.status(500).json({message:"Internal Server Error"});
    }
  };

  module.exports=validateUser;