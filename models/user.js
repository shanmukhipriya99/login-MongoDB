require("dotenv").config({ path: "./config/.env"});
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
//User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rno: { type: Number, required: true },
    email: { type: String, required: true, 
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ("Invalid email");
            }
        }
    },
    password: { type: String, required: true },
    coreMember: { type: Boolean, default: false},
    tokens: [{
        token: { type: String, required: true}
    }]
});

//Hash the password before saving in the database
userSchema.pre("save", async function(next) {
    const user = this;
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

//Check for existing users and valid passwords
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) throw new Error("Login failed!");
    const matching = await bcrypt.compare(password, user.password);
    if(!matching) throw new Error("Password incorrect, login failed!");
    return user;
}

//Generate JWT token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({email: user.email}, process.env.JWT_KEY, { expiresIn: "5h" });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
//User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
