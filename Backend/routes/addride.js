const express = require("express")
const router = express.Router()
const Ride = require("../models/Rides")

router.post("/", async (req, res) => {
  
  try {
    ride = await Ride.create({
      name: req.body.name,
      user_id: req.body.id,
      from: req.body.from.toLowerCase(),
      to: req.body.to,
      date: new Date(req.body.date), 
      vechileName: req.body.vechileName,
      vechileNumber: req.body.vechileNumber,
      time: req.body.time,
      persons: req.body.persons,
      phone : req.body.phone,
      amount: req.body.amount,
      DL: req.body.DL,
      aadhaar: req.body.aadhaar,
      carimg: req.body.carimg,
      negotiable: req.body.negotiable
    });
    res.json({ success: "Ride Published successfully" });

  } catch (error) {
    console.log(error);
    res.json({ error: "Error adding Ride" });
  }
   
})
module.exports = router