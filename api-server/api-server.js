const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const socket = require('socket.io');
const bluebird = require('bluebird');
const nprSender = require('./js/nrp-sender-shim');
const redisConnection = require("./js/redis-connection");
const redis = require('redis');
const client = redis.createClient();
const jwtDecode = require('jwt-decode');
const users = require('./data/users');



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




const server = app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log("Your website is being run on http://localhost:3001");
});

//socket setup

const io = socket(server);

let activeUsers = [];
io.on('connection', (client) => {
    // console.log(`Establish socket connection ${client.id}`);

    client.on("loggedIn", async (data) => {
        // console.log('logged in socket got called');
        let authenticatedUser;
        if(data.token !== undefined) {
            let decoded = jwtDecode(data.token);            
            authenticatedUser = await users.getUserById(decoded.id);
        }

        let connectedUser = {
            socketId: client.id,
            id: authenticatedUser._id,
            username: authenticatedUser.username
        };

        let redundantUser = activeUsers.find((element) => {
            return element.username === connectedUser.username
        })

        if(redundantUser === undefined) {
            console.log("appending to activeUsers");
            activeUsers.push(connectedUser);
        }

        console.log(activeUsers);
    });

    client.on('userFavoriteList', (data) => {

        console.log('ACTIVE USERS');
        console.log(activeUsers);

        io.sockets.emit('userFavoriteList', {
            activeUsers: activeUsers
        });
    });

    client.on('disconnect', (data) => {
        activeUsers = activeUsers.filter((element) => { //remove disconnected from active user list
            return element.socketId !== client.id;
        });
    });

});



