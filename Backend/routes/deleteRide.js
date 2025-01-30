const express = require("express");
const router = express.Router();
const Ride = require("../models/Rides");
router.delete("/", async (req, res) => {
  try {
    const {_id} = req.body
    const ride = await Ride.findByIdAndDelete(_id)
    if (!ride) {
        res.status(404).json({ error: "Ride not found" });
      }
    res.json({success:"Ride deleted succesfully"})
  } catch (error) {
    console.log(error)
    res.json({ error: "Error deleting Ride" });
  }
});

module.exports = router;
