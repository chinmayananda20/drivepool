const express = require("express");
const router = express.Router();
const Ride = require("../models/Rides");
router.post("/", async (req, res) => {
  try {
    let { from } = req.body;
    from = from.toLowerCase();

    let ride = await Ride.find({ from });
    if(ride){
        res.json(ride)
    }
    else{
        res.json({messsage:"No rides found"})
    }
  } catch (error) {
    console.log(error)
    res.json({ error: "Error fetching Rides" });
  }
});

module.exports = router;
