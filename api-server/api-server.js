const express = require("express");
const app = express();
const bodyParser = require("body-parser");


const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const flash = require("connect-flash");


const configRoutes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(flash())




configRoutes(app);


app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log("Your website is being run on http://localhost:3001");
});