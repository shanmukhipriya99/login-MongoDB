const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/schedule")
.then(() => {
    console.log("Connected to database...");
})
.catch(err => {
    console.log(err);
});