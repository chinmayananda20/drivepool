const express = require("express");
const router = express.Router();
const Ride = require("../models/Rides");
router.post("/", async (req, res) => {
  try {
    const { _id,name,date,from,to,vechileName,vechileNumber,phone,time,persons,aadhaar,DL,amount,carimg } = req.body;

    let ride = await Ride.findOne({ _id });
    ride.name = name
    ride.date = new Date(date), 
    ride.from = from.toLowerCase();
    ride.to=to
    ride.vechileName = vechileName
    ride.vechileNumber=vechileNumber
    ride.phone=phone
    ride.time=time
    ride.persons=persons
    ride.aadhaar=aadhaar
    ride.DL = DL
    ride.amount = amount
    ride.carimg = carimg
    ride.save()
    res.json({success:"Updated Successfully"})
  } catch (error) {
    console.log(error)
    res.json({ error: "Error fetching Rides" });
  }
});

module.exports = router;
