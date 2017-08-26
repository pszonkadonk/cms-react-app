const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const socket = require('socket.io');
const bluebird = require('bluebird');
const nprSender = require('./js/nrp-sender-shim');
const redisConnection = require("./js/redis-connection");
const redis = require('redis');
const client = redis.createClient();


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


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


configRoutes(app);

const activeUsers = [];


const server = app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log("Your website is being run on http://localhost:3001");
});

//socket setup

const io = socket(server);

io.on('connection', (client) => {
    console.log("connected!");
    console.log(`Establish socket connection ${client.id}`);

    client.on("loggedIn", (data) => {
        console.log("DATA HAS BEEN PASSED");
        console.log(data);
    });

});

