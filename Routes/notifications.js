const express = require("express");
const { Group, User } = require("../db/schema");
const { models } = require("mongoose");
const { verifyUser } = require("./auth");
const router = express.Router();


//sending notification

router.post("/send",verifyUser,async(req,res)=>{

    const {groupid,from,to,amount,note,type}=req.body;
    const date= new Date();
    

    console.log(req.body);
    try {

        //find the user to send the notification
        const receiver=await User.findOne({email:to});
        //find the grouu from which the request is made
        const group=receiver.groups.find((group)=>group.group_id==groupid);
        //console.log(group);
        const groupname=group.group_name;
        //console.log(receiver);
        const notification={
            notification_type:type,
            from:from,
            amount:amount,
            note:note,
            date:date,
            Read:false,
            group_name:groupname
        }
        receiver.notifications.push(notification);
        const updateduser=await receiver.save();
        res.status(200).json({message:"Notification sent"})
    } catch (error) {
        console.log(error);
    }

})

router.get("/get",verifyUser,async (req,res)=>{
    const email = req.header("email");
    console.log(email);
    try {
        
        const user= await User.findOne({email:email});
        const notifications=user.notifications;
        console.log(notifications);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({message:"Error"})
    }
})


module.exports = router;