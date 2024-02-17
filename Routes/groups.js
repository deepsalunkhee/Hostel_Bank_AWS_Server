const express = require("express");
const { Group, User } = require("../db/schema");
const { models } = require("mongoose");
const router = express.Router();
const { verifyUser,AutheriseUser } = require("../Routes/auth");

//creating groups

router.post("/create", verifyUser, async (req, res) => {
  const { Groupname, creater } = req.body;
  console.log(req.body);
  const newGroup = new Group({
    name: Groupname,
    users: [{ email: creater, member_id: 0 }],
    member_count: 1,
    transction_matrix: [[0]]
  });

  //saving the group
  try {
    //find the user and push the group id
    const user = await User.findOne({ email: creater });
    const savedGroup = await newGroup.save();
    const updateduser = user.groups.push({
      group_id: savedGroup._id,
      group_name: savedGroup.name,
    });
    const updated = await user.save();

    res.status(200).json({
      message: "Group created successfully",
      GroupCode: savedGroup._id,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//get the user's groups

router.post("/getgroups", verifyUser, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    const groups = user.groups;

    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

//join group

router.post("/joingroup", verifyUser, async (req, res) => {
  const { groupid } = req.body;
  try {
    const group = await Group.findById(groupid);
    // console.log(group);
    const user_count = group.member_count;
    if (group == null) {
      res.status(207).json({ message: "Group not found" });
      console.log("Group not found");
    }

    const user = await User.findOne({ email: req.user });

    const userUpdates= user.groups.push({
      group_id: group._id,
      group_name: group.name,
    })

    const groupCountUpdates = group.member_count = user_count + 1;

    const groupUpdates = group.users.push({
      email:req.user,
      member_id: user_count ,

    })
    //updating the transaction matrix
    //by pushing a new row and column
    const transaction_matrix_updates = group.transction_matrix.push([0]);
    for(let i=0;i<user_count;i++){
      group.transction_matrix[user_count].push(0);
    }
    for (let i = 0; i < user_count; i++) {
      group.transction_matrix[i].push(0);
    }
    

    //saving the updates
    const updatedUser = await user.save();
    const updatedGroup = await group.save();



    res.status(200).json({ message: "Group joined successfully",groupname:group.name });
    



  } catch (error) {

    res.status(400).json({ message: "Something went wrong on server" });
  }
});

//get group info

router.get("/getgroupinfo",verifyUser,async(req,res)=>{
  const groupid =req.header("groupid");;
  // console.log(groupid);
  try {
    const groupinfo=await Group.findById({_id:groupid});
    // console.log(groupinfo);
    res.status(200).json(groupinfo);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
