const express = require("express");
const router = express.Router();
const Ride = require("../models/Rides");
router.get("/", async (req, res) => {
  try {
    const rides =await  Ride.find({});
    res.json(rides);
  } catch (error) {
    console.log(error)
    res.json({ error: "Error fetching Rides" });
  }
});

module.exports = router;
