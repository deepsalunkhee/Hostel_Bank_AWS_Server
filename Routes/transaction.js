const express = require("express");
const { Group, User } = require("../db/schema");
const { models } = require("mongoose");
const router = express.Router();
const { verifyUser, AutheriseUser } = require("../Routes/auth");

//creating a money request

router.post("/request",verifyUser,async(req,res)=>{
    const{groupid,requestfrom,requestto,amount,note}=req.body;
    // console.log(req.body);
    

    try {
        
        const group = await Group.findById(groupid);
        // console.log(group);
        const from= group.users.findIndex((user)=>user.email==requestfrom);
        //console.log(from);
        const from_id=group.users[from].member_id;
        //console.log(from_id);
        const to=group.users.findIndex((user)=>user.email==requestto);
        const to_id=group.users[to].member_id;

        const currtotake=parseInt(group.transction_matrix[to_id][from_id]);
        const currtogive=parseInt(group.transction_matrix[from_id][to_id]);
        if(currtogive!=0){
            if(currtogive>=amount){
                group.transction_matrix[from_id][to_id]=parseInt(currtogive)-parseInt(amount);
                
            }else{
                group.transction_matrix[from_id][to_id]=0;
                group.transction_matrix[to_id][from_id]=parseInt(amount)-parseInt(currtogive);
            }
        }else{
        group.transction_matrix[to_id][from_id]= parseInt(amount)+parseInt( group.transction_matrix[to_id][from_id]);
        }

        const updatedgroup=await group.save();



        res.status(200).json({
            message: "Request sent successfully",
        });
        
    } catch (error) {
        console.log(error);
    }

})

//creating a money settle request

router.post("/settle",verifyUser,async(req,res)=>{
    const{groupid,requestfrom,requestto,amount,type}=req.body;
    // console.log(req.body);
    try {
        
        const group=await Group.findById(groupid);
        const from= group.users.findIndex((user)=>user.email==requestfrom);
        const from_id=group.users[from].member_id;
        const to=group.users.findIndex((user)=>user.email==requestto);
        const to_id=group.users[to].member_id;
        
        if(type==="toGive"){
            group.transction_matrix[from_id][to_id]=0;
            
        }
        if(type==="toTake"){
            group.transction_matrix[to_id][from_id]=0;
        }
        const updatedgroup=await group.save();
        res.status(200).json({
            message: "settle request sent successfully",
        });
    } catch (error) {
        console.log(error);
    }
})




module.exports = router;
