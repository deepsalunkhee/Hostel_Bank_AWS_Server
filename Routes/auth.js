const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Group } = require("../db/schema");
dotenv.config();

// Middleware function to verify user token
const verifyUser = (req, res, next) => {
    const token = req.header("token");
    //  console.log(token);
    if (!token) {
        return res.status(401).json({ error: "Please login" });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.email;
         next();
    } catch (error) {
        res.status(500).json({ error: "Please login again" });
    }
}

//not completed
const AutheriseUser= async (req,res,next) =>{

    const groupid=req.header("groupId");
    const user =req.header("user");
  
    

    try {
        const group=await Group.findById(groupid);
        const userindex=group.users.findIndex((user)=>user.email==user);
        if(userindex==-1){
            res.status(401).json({error:"You are not a member of this group"});
        }
        next();
    } catch (error) {
        res.status(500).json({error:"Something went wrong"});
        console.log("autherisation",error);
        
    }


}

// Exporting the middleware
module.exports = {verifyUser,AutheriseUser};
