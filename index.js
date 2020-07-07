//Importing packages
const express = require("express");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 8000

//Importing routes
const users = require("./routes/users");

//Importing middleware
app.use(express.json());
app.use(users);


//App connection
app.listen(port, () => {
    console.log("Listening on port " + port);
});