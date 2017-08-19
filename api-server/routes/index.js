const express = require("express");
const users = require('../data/users');
const xss = require("xss");
const bluebird = require('bluebird');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');
const config = require("../config");
const redisConnection = require('../js/redis-connection');
const nprSender = require('../js/nrp-sender-shim');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


require('../passport-config/passport-strat.js')(passport, Strategy);



const constructorMethod = (app) => {

    // register user
    app.post('/register',
        async (req, res) => {
            let username = xss(req.body.username);
            let password = xss(req.body.password);
            let administrator = req.body.administrator;
            if(administrator ==="") {
                administrator = false;
            }
            let message = {
                redis: redisConnection,
                eventName: 'create-user',
                data: {
                    username: username,
                    password: password,
                    administrator: administrator
                },
                method: 'POST',
                expectsResponse: true
            }

            let response = await nprSender.sendMessage(message);
            console.log("RESPONSE");
            console.log(response);
            res.send(response);
            
        });


    //log in user
    app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
         (req, res) => {
            console.log("I've successfully logged in");
            const token = jwt.sign({
                id: req.user._id,
                username: req.user.username,
                administrator: req.user.administrator
            }, config.jwtSecret);
            
            let returnObject = {
                administrator: req.user.administrator,
                token: token
            }
            console.log("Sending")
            console.log(returnObject);
            res.json(returnObject);
    });


    //get user list
    app.get('/user-list', async (req, res) => {
        console.log(req);
        let decoded = jwtDecode(req.headers.authorization);
        console.log(decoded);
        let authenticatedUser = await users.getUserById(decoded.id);

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'fetch-users',
                method: 'GET',
                expectsResponse: true
            }
            let response = await nprSender.sendMessage(message);
            res.json(response);
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    });

    //make user an administrator
    app.put('/make-administrator', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let updatedUser = req.body.user;
        console.log(updatedUser);

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'make-admin',
                data: {
                    username:updatedUser
                },
                method: 'PUT',
                expectsResponse: true
            }
            let response = await nprSender.sendMessage(message);
            console.log("RESPONSE");
            console.log(response);
            res.json(response);
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    });

    app.post("/add-structure", async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        console.log(req.body);

        let structureName = req.body

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'add-structure',
                data: {
                    structureName: structureName
                },
                method: 'POST',
                expectsResponse: true
            }

            nprSender.sendMessage(message).then((response) => {
                console.log("RESPONSE");
                console.log(response);
                res.json(response);    
            }).catch((err) => {
                res.json({error:"Could not add structure"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    })




    
}

module.exports = constructorMethod;