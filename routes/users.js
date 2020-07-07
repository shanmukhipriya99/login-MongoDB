const express = require("express");
const User = require("../models/user");
const router = new express.Router();

//POST for signup
router.post("/signup", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if(user) throw new Error("Email already exists!");
        user = new User(req.body);
        const token = await user.generateAuthToken();
        res.status(201).send({ message: "Signup successful!", user, token});
    }
    catch(err) {
        res.status(400).send({err: err.message});
    }
});

//POST for login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ message: "Login Successfull!", user, token });
    }
    catch(err) {
        res.status(400).send("Login failed!");
    }
});

module.exports = router;