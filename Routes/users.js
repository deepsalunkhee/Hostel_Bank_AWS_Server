//all the user realted routes are here
const express = require("express");
const router = express.Router();
const { User } = require("../db/schema");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {verifyUser} = require("../Routes/auth");
const nodemailer = require("nodemailer");
const e = require("express");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const salt = bcrypt.genSaltSync(saltRounds);



//data validation schema
const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(4).max(50),
});

const signinSchema = zod.object({
    email:zod.string().email(),
    password:zod.string().min(4).max(50)
})

//signup route

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Validate the data
  try {
    const validatedData = signupSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "Invalid data" });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email: email });
  
  if (existingUser) {
    console.log("User already exists");
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create a new user
  const newUser = new User({
    email: email,
    passwordHash: hashedPassword,
  });

  // Save the user to the database
  try {
    const savedUser = await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


//signin route

router.post("/signin",async(req,res)=>{

    const {email,password}=req.body;
    const validatedData=signinSchema.parse(req.body);
    if(validatedData){
        try {

            //check if the user exists
            const user=await User.findOne({email:email});
            if(!user){
                return res.status(400).json({error:"User does not exist"});
            }

            //check if the password is correct
            const isPasswordCorrect=bcrypt.compareSync(password,user.passwordHash);
            if(!isPasswordCorrect){
                return res.status(400).json({error:"Password is incorrect"});
            }

            //sign the token
            const token=jwt.sign({id:user._id,email:email},JWT_SECRET);
            res.json({token:token});
            
            
        } catch (error) {
            res.status(500).json({error:"Internal server error"});
            
        }
    }else{
        res.status(400).json({error:"Invalid data"});
    }


})

router.get("/userdata",verifyUser,async(req,res)=>{
    const user=await User.findOne({email:req.user});
    console.log("hi");
    res.json({email:user.email});
  
   
})

router.post("/changepassword",verifyUser,async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword,email}=req.body;
    console.log(req.body);
    try{
    
    const user=await User.findOne({email:email});
    
    const isPasswordCorrect=bcrypt.compareSync(oldPassword,user.passwordHash);
    console.log(isPasswordCorrect);
    if(!isPasswordCorrect){
        return res.status(400).json({error:"Old Password is incorrect"});
    }
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.passwordHash=hashedPassword;
    await user.save();
    res.status(200).json({message:"Password Changed"});
    console.log("password changed");
    }
    catch(error){
        res.status(500).json({error:"Internal server error"});
    }
});

router.post("/forgotpassword",async(req,res)=>{
    const {email}=req.body;
    // console.log(req.body);
    try{
        const user=await User.findOne({email:email});
        // console.log(user);
        if(!user){
            return res.status(400).json({error:"User does not exist"});
        }
        //create a 8 digit random password
        const randomPassword=Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, salt);
        user.passwordHash=hashedPassword;
        await user.save();
      

        //sendign mail


        // nodemailer transporter (for the credentials and authorization)
      // using Brevo for SMTP (visit its documentation for more details)
      let transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // Your Brevo email
          pass: process.env.EMAIL_PASS, // Your Brevo password
        },
      });

      // HTML and CSS content for the email
      const emailContent = `
      
            <p>Hello ${email},</p>
            <p class="thank-you">Password has been Changed</p>
            <p>Your new password is ${randomPassword}</p>
            <a class="button" href="https://hostel-bank.vercel.app/">Click Here To Login</a>
        
      
    `;

      //

      // sending email and providing data (what to send, whom to send, etc)
      let info = await transporter.sendMail({
        from: "deepsalunkhee@gmail.com", // Sender address
        to: `${email}`, // Recipient's email
        subject: "Password Changed", // Subject line
        text: emailContent, // Plain text body
      });

      res.status(200).json({message:"Password changed successfully"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }

    
    
    
}
)

module.exports = router;
