const express = require("express")
const router = express.Router()
const Contact = require('../models/Contact')

router.post("/", async (req, res) => {
  
  try {
    contact = await Contact.create({
      name: req.body.name,
      message : req.body.message,
      email: req.body.email
    });
    res.json({ success: "added message successfully" });

  } catch (error) {
    console.log(error);
    res.json({ error: "Error adding Ride" });
  }
   
})
module.exports = router