const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

router.post("/",[
    body("password", "password must be minimum of 6 characters").isLength({
      min: 6,
    }),
  ],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log( "return res.status(400).json({ errors: errors.array()})")
      return res.json({ error: "password must be minimum of 6 characters" });
    }
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    try {
      let user = await User.findOne({ email });
      user.password = secPass;
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }
      user.save();
      res.json({ success: "password changed successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong!");
    }
  }
);
module.exports = router;
