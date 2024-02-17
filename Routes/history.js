const express = require("express");
const { Group, User } = require("../db/schema");
const { models } = require("mongoose");
const { verifyUser } = require("./auth");
const router = express.Router();

//add to history
router.post("/add",verifyUser,async(req,res)=>{
    //this is just basic history format I would like to add more details in it
    //in the future
    const {groupid,from,to,amount,type}=req.body;
    try {
        const settler=await User.findOne({email:from});
        const settlee= await User.findOne({email:to});
        if(type==="toGive"){
            const history_settler={
                amount:amount,
                note:"You gave "+amount+" to "+to,
                date:new Date(),
                history_type:"Sent",
                with:to
            }
            const history_settlee={
                amount:amount,
                note:"You received "+amount+" from "+from,
                date:new Date(),
                history_type:"Received",
                with:from
            }
            settler.history.push(history_settler);
        settlee.history.push(history_settlee);
        const updatedsettler=await settler.save();
        const updatedsettlee=await settlee.save();
        }else if(type==="toTake"){
            const history_settler={
                amount:amount,
                note:"You received "+amount+" from "+to,
                date:new Date(),
                history_type:"Received",
                with:to
            }
            const history_settlee={
                amount:amount,
                note:"You gave "+amount+" to "+from,
                date:new Date(),
                history_type:"Sent",
                with:from
            }

            settler.history.push(history_settler);
        settlee.history.push(history_settlee);
        const updatedsettler=await settler.save();
        const updatedsettlee=await settlee.save();
        }

        

       res.status(200).json({message:"History added"}) 
    } catch (error) {
        console.log(error);
    }
})

router.get("/get",verifyUser,async(req,res)=>{
    const email=req.header("email");
    try {

        const user = await User.findOne({email:email});
        
        
        res.status(200).json(user.history);
    } catch (error) {
        console.log(error);
    }
})

module.exports=router;