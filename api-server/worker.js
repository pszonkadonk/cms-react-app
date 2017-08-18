const redisConnection = require('./js/redis-connection');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require('flat');
const request = require('request');
const unflatten = flat.unflatten;
const users = require('./data/users');



bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

console.log("Worker started....");



redisConnection.on("create-user:post:*", (message, channel) => {

    let requestId = message.requestId;
    let eventName = message.eventName;

    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;


    console.log("You have reacted create-user:post");

    let username = message.data.username;
    let password = message.data.password;
    let administrator = message.data.administrator;

    console.log(message);
    users.addUser(username, password, administrator).then((newUser) => {
        if(newUser === undefined) {
            console.log("User created");
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: newUser,
                eventName: eventName
            });
        } else {
            console.log("Could not crate user");
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