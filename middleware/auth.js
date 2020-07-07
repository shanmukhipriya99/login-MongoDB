require("dotenv").config({ path: "./config/.env"});
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { use } = require("../routes/users");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ email: decoded.email, "tokens.token": token });
        req.user = user;
        req.token = token;
        next();
    }
    catch(err) {
        res.status(400).send({ e: "Invalid token" });
    }
};

module.exports = auth;