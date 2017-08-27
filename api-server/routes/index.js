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

const storageImages = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../src/client/pictures')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending 
    }
  })

  const storageFiles = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../src/client/files')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending 
    }
  })
  

const uploadDest = multer({ storage: storageImages});
const uploadDestFile = multer({storage: storageFiles});
const zip = require('adm-zip');
const fs = require('fs');
const path = require('path');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


require('../passport-config/passport-strat.js')(passport, Strategy);



const constructorMethod = (app) => {



    app.get("/retrieve-favorites/:structureSlug", async(req, res) => {
        
        let structureSlug = req.params.structureSlug;
        
        let message = {
            redis: redisConnection,
            eventName: 'retrieve-favorites',
            method: 'GET',
            data: {
                structureSlug: structureSlug
            },
            expectsResponse: true
        }
        nprSender.sendMessage(message).then((response) => {
            res.send(response);    
        }).catch((err) => {
            res.json({error:err});
        });
        
    });

    app.post('/submit-comment', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);
        
        let author = decoded.username;


        if(authenticatedUser !== "undefined") {             
            let message = {
                redis: redisConnection,
                eventName: 'submit-comment',
                method: 'POST',
                data: {
                    commentText: req.body.data.commentText,
                    entrySlug: req.body.data.entrySlug,
                    structureSlug: req.body.data.structureSlug,
                    author: author,
                    createdDate: req.body.data.createdDate
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
    })
    app.get('/download/:fileName', async(req, res) => {
        

        let fileName = req.params.fileName;
        
        let filePath = path.join(__dirname, '..', '..', 'src', 'client', 'files', 'files_zipped', `${fileName}.zip`)
        


        res.sendFile(filePath);
        
    });        

    // register user
    app.post('/register',
        async (req, res) => {
            let username = xss(req.body.username);
            let password = xss(req.body.password);
            let administrator = req.body.administrator;
            let biography = req.body.biography;
            if(administrator ==="") {
                administrator = false;
            }
            let message = {
                redis: redisConnection,
                eventName: 'create-user',
                data: {
                    username: username,
                    password: password,
                    administrator: administrator,
                    biography: biography
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

    app.get('/public/user-list', async (req, res) => {
            let pageNumber = parseInt(req.query.page);
            let message = {
                redis: redisConnection,
                eventName: 'fetch-users-pageinate',
                data: {
                    pageNumber: pageNumber
                },
                method: 'GET',
                expectsResponse: true
            }
            let response = await nprSender.sendMessage(message);
            
            res.json(response);
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

    //get particular entry 
    app.get('/public/:structureSlug/:entrySlug', async(req, res) => {

        let structureSlug = req.params.structureSlug;
        let entrySlug = req.params.entrySlug;

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
    });

    // post new entry
    app.post('/submit-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let author = decoded.username;


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


    //upload image
    app.post('/edit-upload-image', uploadDest.single('photo'), async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);


        let entrySlug = req.body.entrySlug;
        let structureSlug = req.body.structureSlug;


        // if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {            
        //     let message = {
        //         redis: redisConnection,
        //         eventName: 'update-entry-image',
        //         method: 'PUT',
        //         data: {
        //             entryData: req.body.data.fields,
        //             structureSlug: req.body.data.structureSlug

        //         },
        //         expectsResponse: true
        //     }
        //     nprSender.sendMessage(message).then((response) => {
        //         res.send(response);    
        //     }).catch((err) => {
        //         res.json({error:err});
        //     });
        //     }
        //     else {
        //     res.json({error: "Could not authenticate user"});
        //     }

        res.send(req.file);

    });

    //upload file
    app.post('/upload-file', uploadDestFile.single('file'), async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let zipper = new zip();
    
        let localFilePath = path.join(__dirname, '..', '..', 'src', 'client', 'files', `${req.file.filename}`)
        
        let zipFilePath = path.join(__dirname, '..', '..', 'src', 'client', 'files_zipped', `${req.file.filename}.zip`)

        zipper.addLocalFile(localFilePath);
        
        // zipper.addLocalFile(`/Users/pszonkadonk/Documents/Stevens/cms-react-app/src/client/${req.file.filname}`);

        zipper.writeZip(zipFilePath);
        
        res.send(req.file);

    });

    //add entry 
    app.post('/submit-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);


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

    //delete entry 
    app.put('/update-entry', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let author = decoded.username;

        if(authenticatedUser !== "undefined" && authenticatedUser.administrator) {            
                       
            let message = {
                redis: redisConnection,
                eventName: 'update-entry',
                method: 'PUT',
                data: {
                    entryData: req.body.data.fields,
                    entryCollection: `${req.body.data.structureSlug}-entries`,
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


    //favorite entry
    app.post('/favorite', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let user = decoded.username
        let userId = decoded.id
        


        if(authenticatedUser !== "undefined") {            
            let entrySlug = req.body.data.entrySlug;
            let structureSlug = req.body.data.structures;
            let entryCollection = `${req.body.data.structures}-entries`        
            
            let message = {
                redis: redisConnection,
                eventName: 'favorite-entry',
                method: 'POST',
                data: {
                    entryCollection: entryCollection,
                    entrySlug: entrySlug,
                    structureSlug: structureSlug,
                    user: user,
                    id: userId
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

    //unfavorite entryr
    app.delete('/unfavorite', async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let user = decoded.username
        let userId = decoded.id
        

        if(authenticatedUser !== "undefined") {            
            let entrySlug = req.body.entrySlug;
            let structureSlug = req.body.structures;
            let entryCollection = `${req.body.structures}-entries`        
            
            let message = {
                redis: redisConnection,
                eventName: 'unfavorite-entry',
                method: 'DELETE',
                data: {
                    entryCollection: entryCollection,
                    entrySlug: entrySlug,
                    structureSlug: structureSlug,
                    user: user,
                    id: userId
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


    app.get("/users", async(req, res) => {
        let decoded = jwtDecode(req.headers.authorization);
        let authenticatedUser = await users.getUserById(decoded.id);

        let user = decoded.username
        let userId = decoded.id

        if(authenticatedUser !== "undefined") {            
            
            let message = {
                redis: redisConnection,
                eventName: 'retrieve-userData',
                method: 'GET',
                data: {
                    username: user,
                    userId: userId
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







}

module.exports = constructorMethod;