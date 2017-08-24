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
const multer = require('multer');
const uploadDest = multer({ dest: './client/pictures'});
const uploadDestFile = multer({dest: './client/files'});


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
            res.send(response);
            
        });


    //log in user
    app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
         (req, res) => {
            const token = jwt.sign({
                id: req.user._id,
                username: req.user.username,
                administrator: req.user.administrator
            }, config.jwtSecret);
            
            let returnObject = {
                administrator: req.user.administrator,
                token: token
            }
            res.json(returnObject);
    });


    //get user list
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

    //make user an administrator
    app.put('/make-administrator', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let updatedUser = req.body.user;

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
            res.json(response);
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    });
    //add new structure
    app.post("/add-structure", async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);


        let structure = req.body

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'add-structure',
                data: {
                    structure: structure
                },
                method: 'POST',
                expectsResponse: true
            }

            nprSender.sendMessage(message).then((response) => {
                res.json(response);    
            }).catch((err) => {
                res.json({error:"Could not add structure"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    })

    // get list of all structure
    app.get("/structure-list", async(req, res) => {
        // let decoded = jwtDecode(req.headers.authorization);
        // let authenticatedUser = await users.getUserById(decoded.id);

        // if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'structure-list',
                method: 'GET',
                expectsResponse: true
            }

            nprSender.sendMessage(message).then((response) => {
                // console.log("RESPONSE in route path");
                // console.log(response);
                res.send(response);    
            }).catch((err) => {
                res.json({error:"Could not get structure list"});
            });
        // } else {
        //     res.json({error: "Could not authenticate user"});
        // } 
    });

    // update structure
    app.put("/update-structure", async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let structure = req.body
        

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'update-structure',
                method: 'PUT',
                data: {
                    structure: structure
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                console.log("RESPONSE in route path");
                console.log(response);
                res.send(response);    
            }).catch((err) => {
                res.json({error:"Could not update structure"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        }  
    });

    // remove structure and associated entries
    app.delete("/remove-structure", async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let slug = req.body.slug;
        let name = req.body.name;

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'remove-structure',
                method: 'DELETE',
                data: {
                    name: name,
                    slug: slug,
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                res.send(response);    
            }).catch((err) => {
                res.json({error:"Could not update structure"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        }  
    });

    //public route
    app.get('/structure-entries/:slug', async(req, res) => {
        let slug = req.params.slug;
        
        let message = {
            redis: redisConnection,
            eventName: 'structure-entries',
            method: 'GET',
            data: {
                slug: slug,
            },
            expectsResponse: true
        }
        nprSender.sendMessage(message).then((response) => {
            res.send(response);    
        }).catch((err) => {
            res.json({error:"Could not get entries"});
        });
    });

    // post new entry
    app.post('/submit-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let author = decoded.username

        console.log("BODY");
        console.log(req.body);

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {            
            let entryData = req.body.data.entryLog;
            let entryCollection = `${req.body.data.slug}-entries`        
            
            let message = {
                redis: redisConnection,
                eventName: 'submit-entry',
                method: 'POST',
                data: {
                    entryData: entryData,
                    entryCollection: entryCollection,
                    entrySlug: req.body.data.entrySlug,
                    title: req.body.data.title,
                    description: req.body.data.description,
                    author: author,
                    createdDate: req.body.data.createdDate,
                    comments: req.body.data.comments
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                res.send(response);    
            }).catch((err) => {
                res.json({error:err});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    });

    //upload image
    app.post('/upload-image', uploadDest.single('photo'), async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        res.send(req.file);

    });

    //upload file
    app.post('/upload-file', uploadDestFile.single('file'), async(req, res) => {
        console.log("hello frmo upload file");
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);


        res.send(req.file);

    });

    //delete entry 
    app.post('/submit-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        console.log(req.body);

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {            
            let entryData = req.body.data.entryLog;
            let entryCollection = `${req.body.data.slug}-entries`        
            
            let message = {
                redis: redisConnection,
                eventName: 'submit-entry',
                method: 'POST',
                data: {
                    entryData: entryData,
                    entryCollection: entryCollection,
                    entrySlug: req.body.data.entrySlug,
                    title: req.body.data.title,
                    description: req.body.data.description,
                    author: author,
                    createdDate: req.body.data.createdDate,
                    comments: req.body.data.comments
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                res.send(response);    
            }).catch((err) => {
                res.json({error:err});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        } 
    });

    //upload image
    app.delete('/remove-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let entrySlug = req.body.entrySlug;
        let structureSlug = req.body.structureSlug;

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'remove-entry',
                method: 'DELETE',
                data: {
                    entrySlug: entrySlug,
                    structureSlug: structureSlug
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                res.send(response);    
            }).catch((err) => {
                res.json({error:"Could not remove entry"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        }  
    });

    //get particular entry 
    app.get('/:structureSlug/:entrySlug', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        console.log(req.params);
        let structureSlug = req.params.structureSlug;
        let entrySlug = req.params.entrySlug;


        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {
            let message = {
                redis: redisConnection,
                eventName: 'structure-entry',
                method: 'GET',
                data: {
                    entrySlug: entrySlug,
                    structureSlug: structureSlug
                },
                expectsResponse: true
            }
            nprSender.sendMessage(message).then((response) => {
                res.send(response);    
            }).catch((err) => {
                res.json({error:"Could not remove entry"});
            });
        }
        else {
            res.json({error: "Could not authenticate user"});
        }  
    });


}

module.exports = constructorMethod;