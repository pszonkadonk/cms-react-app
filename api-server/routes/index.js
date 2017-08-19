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

    app.post('/register',
        async (req, res) => {
            let username = xss(req.body.username);
            let password = xss(req.body.password);
            let administrator = xss(req.body.administrator);
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


    app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
         (req, res) => {
            console.log("I've successfully logged in");
            const token = jwt.sign({
                id: req.user._id,
                username: req.user.username,
                administrator: req.user.administrator
            }, config.jwtSecret);
            
            let returnObject = {
                userId: req.user._id,
                username: req.user.username,
                administrator: req.user.administrator,
                token: token
            }
            res.json({returnObject});
    });

    app.get('/user-list', async (req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
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



    
}

module.exports = constructorMethod;