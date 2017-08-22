const redisConnection = require('./js/redis-connection');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require('flat');
const request = require('request');
const unflatten = flat.unflatten;
const users = require('./data/users');
const structures = require('./data/structures');
const mongoCollections = require("./config/mongoCollections");
const dbConnection = require("./config/mongoConnection");
const uuid = require('uuid');




bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

console.log("Worker started....");


redisConnection.on("create-user:post:*", (message, channel) => {

    let requestId = message.requestId;
    let eventName = message.eventName;

    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;


    console.log("You have reached create-user:post");

    let username = message.data.username;
    let password = message.data.password;
    let administrator = message.data.administrator;

    console.log(message);
    users.addUser(username, password, administrator).then((newUser) => {
        if(newUser !== undefined) {
            console.log("User created");
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: newUser,
                eventName: eventName
            });
        } else {
            console.log("Could not create user");
            let warning = "Could not create user";
            redisConnection.emit(failedEvent, {
                requestId: requestId,
                data: warning,
                eventName: eventName
            });
        }
    })
    .catch((err) => { 
        console.log(err);
    });
});

redisConnection.on("fetch-users:get:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
    
        console.log("You have reached fetch-users:get");
        
        users.getAllUsers().then((userCollection) => {
            userCollection.forEach((element) => {
                delete element._id;
                delete element.hashedPassword;
            });
            if(userCollection !== undefined) {
                console.log("getting all users");
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: userCollection,
                    eventName: eventName
                });
            } else {
                console.log("Could not get user collection");
                let warning = "Could not get user collection";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });

redisConnection.on("make-admin:put:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
    
        console.log("You have reached make-admin:put");
        
        let username = message.data.username;

        users.updateUser(username).then((user) => {
            if(user !== undefined) {
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: user,
                    eventName: eventName
                });
            } else {
                let warning = "Could not update User";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });


redisConnection.on("add-structure:post:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached add-structure:post");
        
        let structurePrototype  = message.data.structure;

        structures.addStructure(structurePrototype).then((structure) => {
            if(structure === undefined) {
                let logMessage = "You have added a structure";
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: logMessage,
                    eventName: eventName
                });
            } else {
                let warning = "Could not create structure";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });

redisConnection.on("structure-list:get:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached structure-list:get");
            
        structures.getAllStructures().then((structureList) => {
            console.log("STRUCTURE LIST");
            console.log(structureList);
            if(structureList !== "undefined") {
                let logMessage = "Here are the structures";
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: structureList,
                    eventName: eventName
                });
            } else {
                let warning = "Could not get structure listing";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });

redisConnection.on("update-structure:put:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached update-structure:put");

        let structure = message.data.structure;
            
        structures.updateStructure(structure.slug, structure).then((structureList) => {
            console.log("STRUCTURE LIST");
            console.log(structureList);
            if(structureList !== "undefined") {
                let logMessage = "Here are the structures";
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: structureList,
                    eventName: eventName
                });
            } else {
                let warning = "Could not get structure listing";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });


redisConnection.on("remove-structure:delete:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached remove-structure:delete");

        let deleteSlug = message.data.slug;
        let deleteName = message.data.name;
            

        structures.removeStructure(deleteSlug, deleteName).then((response) => {
            if(response === null) {
                let logMessage = "Structure and Entries Removed";
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: logMessage,
                    eventName: eventName
                });
            } else {
                let warning = "Could not remove structure";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
            }
        })
        .catch((err) => { 
            console.log(err);
        });
    });

redisConnection.on("structure-entries:get:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached structure-entries:get");

        let slug = message.data.slug;

        let entries = [];
        dbConnection().then(db => {
            if(db !== "undefined") {
                let stream = db.collection(`${slug}-entries`).find().stream();
                stream.on('data', (data) => {
                    entries.push(data);
                })
                stream.on('end', function() {
                    console.log('All done!')
                    redisConnection.emit(successEvent, {
                        requestId: requestId,
                        data: entries,
                        eventName: eventName
                    });
                });
            } 
            else {
                let warning = "Could not remove structure";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });  
            }
        });            
        // structures.removeStructure(deleteSlug, deleteName).then((response) => {
        //     if(response === null) {
        //         let logMessage = "Structure and Entries Removed";
        //         redisConnection.emit(successEvent, {
        //             requestId: requestId,
        //             data: logMessage,
        //             eventName: eventName
        //         });
        //     } else {
        //         let warning = "Could not remove structure";
        //         redisConnection.emit(failedEvent, {
        //             requestId: requestId,
        //             data: warning,
        //             eventName: eventName
        //         });
        //     }
        // })
        // .catch((err) => { 
        //     console.log(err);
        // });
    });

redisConnection.on("submit-entry:post:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached submit-entry:post");
        
        
        let entryData = message.data.entryData;
        let entryCollection = message.data.entryCollection;

        let submission = {
            _id: uuid.v4(),
            title: "title",
            structureType: "structureType",
            entrySlug: "unique-entry-slug",
            author: "author",
            createdData: Date.now(),
            fields: entryData,
            comments: []
        }
            
        dbConnection().then(db => {
            if(db !== "undefined") {
                db.collection(entryCollection).insert(submission, (err, entry) => {

                    let logMessage = "Entry has been logged";
                    redisConnection.emit(successEvent, {
                        requestId: requestId,
                        data: logMessage,
                        eventName: eventName
                    });                    
                });
            }
            else {
                let warning = "Could not add entry";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                }); 
            }
        }).catch((err) => { 
            console.log(err);
        });
    });


redisConnection.on("submit-entry:post:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached submit-entry:post");
        
        
        let entryData = message.data.entryData;
        let entryCollection = message.data.entryCollection;

        let submission = {
            _id: uuid.v4(),
            title: "title",
            structureType: "structureType",
            entrySlug: "unique-entry-slug",
            author: "author",
            createdData: Date.now(),
            fields: entryData,
            comments: []
        }
            
        dbConnection().then(db => {
            if(db !== "undefined") {
                db.collection(entryCollection).insert(submission, (err, entry) => {

                    let logMessage = "Entry has been logged";
                    redisConnection.emit(successEvent, {
                        requestId: requestId,
                        data: logMessage,
                        eventName: eventName
                    });                    
                });
            }
            else {
                let warning = "Could not add entry";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                }); 
            }
        }).catch((err) => { 
            console.log(err);
        });
    });




