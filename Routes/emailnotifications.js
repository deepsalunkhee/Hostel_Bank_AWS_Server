const express = require("express");
const { Group, User } = require("../db/schema");
const { models } = require("mongoose");
const { verifyUser } = require("./auth");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv=require("dotenv");
dotenv.config();

//sending notification

router.post("/send",verifyUser,async(req,res)=>{
  const {groupid,from,to,amount,type}=req.body;
  try {
    {
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
      
            <p>Hello ${to},</p>
            <p class="thank-you">You have a notification from ${from}.</p>
            <p>Notification type: ${type === "toGive" || type === "toTake" ? "Settlement" : "Request"}</p>
            <!-- Add any additional message or content here -->
            <p class="message">Please review the notification and take appropriate action.</p>
            <a class="button" href="https://hostel-bank.vercel.app/">Click Here To Login</a>
        
      
    `;

      //

      // sending email and providing data (what to send, whom to send, etc)
      let info = await transporter.sendMail({
        from: "deepsalunkhee@gmail.com", // Sender address
        to: `${to}`, // Recipient's email
        subject: "You got a Notification", // Subject line
        text: emailContent, // Plain text body
      });

      // confirmation of sent email
      // console.log("Message sent: %s", info.messageId);

      // saving the user in firestore(by firebase) database after the mail is sent to the user
      // make sure to modify below block as per requirements

      // ...
    }

    console.log("Mail sent.");
    res.status(200).json({ message: "Mail sent." });
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
});


module.exports = router;





