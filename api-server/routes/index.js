const express = require("express");
const users = require('../data/users');
const xss = require("xss");
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const jwt = require("jsonwebtoken");
const config = require("../config");

require('../passport-config/passport-strat.js')(passport, Strategy);


const constructorMethod = (app) => {

    app.post('/register',
        (req, res) => {
            let username = xss(req.body.username);
            let password = xss(req.body.password);
            let administrator = xss(req.body.administrator);
            users.addUser(username, password, administrator).then((registeredUser) => {
                console.log("You reached the post user routes");
            // res.status(200).redirect('/login?registration=true');
            })
            .catch((err) => { 
                // res.status(401).render('webPages/register',
                //          {error: err, username: username});
                console.log(err);
            });
        });


    app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
         (req, res) => {
            console.log("I've successfully logged in");
            const token = jwt.sign({
                id: req.user._id,
                username: req.user.username
            }, config.jwtSecret);
            console.log(token);
            res.json({token});
    });
}

module.exports = constructorMethod;