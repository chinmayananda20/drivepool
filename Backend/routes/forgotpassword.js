const User = require("../models/User");
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer')
router.post('/',async(req,res)=>{
    try {
        
    
    const { email, otp } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      res.json(
        { error: "Email does not exist" },
        
      );
    }
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, 
        secure: false,
        service: "gmail", 
        auth: {
          user: "komalsingh042015@gmail.com", 
          pass: "htdw ufaa ynjw awwo", 
        },
      });
  
      
      let mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: "Request to Reset your DriveMate password", 
        html: `<p>Hello User</p>
               <br>
               <p>We received a request to reset the password for your account associated with this email address.</p>
               <br>
               <p>If you requested a password reset, please type this OTP in the requested page</p>
               <br>
               <h2>${otp}</h2>
               <br>
               <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>`, 
      };
  
      
      await transporter.sendMail(mailOptions);
  
      
      res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error)
        res.json({error:"Failed to send email"})
    }
})
module.exports = router;
