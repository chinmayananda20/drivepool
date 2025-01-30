const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt")


router.post("/",[
    body('password', 'password must be minimum of 6 characters').isLength({ min: 6 }),
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        return res.json({ error: "Note: 1.Enter valid name  2.Enter valid Email 2.Password must be minimum of 6 characters" })

    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            //return res.status(400).json({ error: "User with this Email already exists!" })
            return res.json({ error: "User with this Email already exists!" })

        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : secPass
        })
        
        res.json({ success:"Signin Successful" })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Something went wrong!")
    }
})
module.exports = router