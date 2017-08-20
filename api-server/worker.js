const redisConnection = require('./js/redis-connection');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require('flat');
const request = require('request');
const unflatten = flat.unflatten;
const users = require('./data/users');
const structures = require('./data/structures');



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
        console.log(newUser);
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
        
        console.log(message);
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
            
            console.log(message);
            let username = message.data.username;

            users.updateUser(username).then((user) => {
                if(user !== undefined) {
                    console.log("updated User");
                    redisConnection.emit(successEvent, {
                        requestId: requestId,
                        data: user,
                        eventName: eventName
                    });
                } else {
                    console.log("Could not update User");
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
                console.log("STRUCTURE");
                console.log(structure);
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