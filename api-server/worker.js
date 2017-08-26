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
const allUsers = mongoCollections.users;
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

    // console.log(message);
    users.addUser(username, password, administrator).then((newUser) => {
        if(newUser !== undefined) {
            // console.log("User created");
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: newUser,
                eventName: eventName
            });
        } else {
            // console.log("Could not create user");
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
                // console.log("getting all users");
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: userCollection,
                    eventName: eventName
                });
            } else {
                // console.log("Could not get user collection");
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
            // console.log("STRUCTURE LIST");
            // console.log(structureList);
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
            // console.log("STRUCTURE LIST");
            // console.log(structureList);
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
        let title = message.data.title;
        let entrySlug = message.data.entrySlug;
        let description = message.data.description;
        let author = message.data.author;
        let createdDate = message.data.createdDate;
        let comments = message.data.comments


        console.log("MESSAGE");
        console.log(message.data);

        let submission = {
            _id: uuid.v4(),
            title: title,
            description: description,
            structureType: entryCollection,
            entrySlug: entrySlug,
            author: author,
            createdDate: createdDate,
            fields: entryData,
            comments: []
        }

        dbConnection().then(db => {
            if(db !== undefined) { //make sure entry slug is uniqie
                db.collection(entryCollection).findOne({entrySlug: entrySlug},(err, entry) => {
                    console.log(entry);
                    if(entry) {
                        console.log("That entry is not unique!");
                        let warning = "That entry Slug is not unique, please try another";
                        redisConnection.emit(failedEvent, {
                            requestId: requestId,
                            data: warning,
                            eventName: eventName
                        });                     
                    }   
                    else {
                        db.collection(entryCollection).insert(submission, (err, entry) => {
                            let logMessage = "Entry has been logged";
                            redisConnection.emit(successEvent, {
                                requestId: requestId,
                                data: logMessage,
                                eventName: eventName
                            });                    
                        });
                    }
                });
            } else {
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

redisConnection.on("remove-entry:delete:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached remove-entry:delete");

        let deleteEntrySlug = message.data.entrySlug;
        let structureSlug = `${message.data.structureSlug}-entries`;
    
        dbConnection().then(db => {
            if(db !== undefined) { //make sure entry slug is uniqie
                db.collection(structureSlug).removeOne({entrySlug: deleteEntrySlug},(err, entry) => {
                    console.log(entry);
                    if(err) {
                        console.log("That entry could not be deleted!");
                        let warning = "That entry could not be deleted!";
                        redisConnection.emit(failedEvent, {
                            requestId: requestId,
                            data: warning,
                            eventName: eventName
                        });                     
                    }
                    else {
                        let logMessage = "Entry Removed";
                        redisConnection.emit(successEvent, {
                            requestId: requestId,
                            data: logMessage,
                            eventName: eventName
                        });
                    }  
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
        }).catch((err) => { 
            console.log(err);
        });
    });

redisConnection.on("structure-entry:get:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached struture-entry:get");

        let structureSlug = `${message.data.structureSlug}-entries`;
        let entrySlug = message.data.entrySlug

        dbConnection().then(db => {
            if(db !== "undefined") {
                db.collection(`${structureSlug}`).findOne({entrySlug: entrySlug}, (err, entry) => {
                    if(err) {
                        let warning = "Could not get entry";
                        redisConnection.emit(failedEvent, {
                            requestId: requestId,
                            data: warning,
                            eventName: eventName
                        });  
                    }
                    else {
                        redisConnection.emit(successEvent, {
                            requestId: requestId,
                            data: entry,
                            eventName: eventName
                        });
                    }
                }) 
            }
            else {
                let warning = "Could not get entry";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });  
            }
        });            
    });

redisConnection.on("update-entry:put:*", (message, channel) => {
    
        let requestId = message.requestId;
        let eventName = message.eventName;
    
        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;
    
        console.log("You have reached update-entry:put");

        console.log("MESSAGE");
        console.log(message);

        let entryCollection = message.data.entryCollection;
        let entrySlug = message.data.entrySlug

        dbConnection().then(db => {
            if(db !== "undefined") {
                db.collection(`${entryCollection}`).
                    update({entrySlug: entrySlug},
                        {
                            $set:{
                                title: message.data.title,
                                description: message.data.description,
                                fields: message.data.entryData
                            }
                        }, (err, entry) => {
                    if(err) {
                        let warning = "Could not update entry";
                        console.log(warning);
                        redisConnection.emit(failedEvent, {
                            requestId: requestId,
                            data: warning,
                            eventName: eventName
                        });  
                    }
                    else {
                        console.log("updated entry");
                        redisConnection.emit(successEvent, {
                            requestId: requestId,
                            data: entry,
                            eventName: eventName
                        });
                    }
                }) 
            }
            else {
                let warning = "Could update entry";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });  
            }
        });            
    });

    redisConnection.on("submit-comment:post:*", (message, channel) => {
        
             let requestId = message.requestId;
             let eventName = message.eventName;
        
             let successEvent = `${eventName}:success:${requestId}`;
             let failedEvent = `${eventName}:failed:${requestId}`;
        
             console.log("You have reached submit-comment:post");
            
             
             let entrySlug = message.data.entrySlug;
             let commentText = message.data.commentText;
             let author = message.data.author;
             let entryCollection = `${message.data.structureSlug}-entries`;// structure slug
             let createdDate = message.data.createdDate;

      
             console.log("MESSAGE");
             console.log(message.data);
      
             let commentSubmission = {
                 _id: uuid.v4(),
                 entrySlug: entrySlug,
                 author: author,
                 createdDate: createdDate,
                 commentText: commentText
             }
      
             dbConnection().then(db => {
                 if(db !== undefined) { //make sure entry slug is uniqie
                     db.collection(entryCollection)
                         .update({entrySlug: entrySlug},
                         { $push: {
                             comments: commentSubmission
                             }
                         },
                     (err, entry) => {
                         console.log(entry);
                         if(entry) {
                             console.log("Added comment!");
                             let message = "Added comment";
                             redisConnection.emit(successEvent, {
                                 requestId: requestId,
                                 data: message,
                                 eventName: eventName
                             });                    
                         }  
                     });
                 } else {
                     let warning = "Could not add comment";
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



    redisConnection.on("unfavorite-entry:delete:*", (message, channel) => {

            let requestId = message.requestId;
            let eventName = message.eventName;

            let successEvent = `${eventName}:success:${requestId}`;
            let failedEvent = `${eventName}:failed:${requestId}`;

            console.log("You have reached favorite-entry:delete");
        
            
            let entrySlug = message.data.entrySlug;
            let structureSlug = message.data.structureSlug;
            let user = message.data.user;
            let userId = message.data.id;

            console.log("MESSAGE");
            console.log(message.data);

            return allUsers().then((userCollection) => {
                return userCollection.update({_id: userId}, {
                    $pull: {
                        favorites: {entrySlug: entrySlug}
                    }
                }).then((response) => {
                    if(!response) {
                        let warning = "Could not unfavorite entry";
                        redisConnection.emit(failedEvent, {
                            requestId: requestId,
                            data: warning,
                            eventName: eventName
                        });
                    }
                    let message = "UnfavoritedFavorited Entry";
                    redisConnection.emit(successEvent, {
                        requestId: requestId,
                        data: message,
                        eventName: eventName
                    });                    
                });
            });
        });

    redisConnection.on("favorite-entry:post:*", (message, channel) => {
        
        let requestId = message.requestId;
        let eventName = message.eventName;

        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;

        console.log("You have reached submit-comment:post");
    
        
        let entrySlug = message.data.entrySlug;
        let structureSlug = message.data.structureSlug;
        let user = message.data.user;
        let userId = message.data.id;
        let entryCollection = message.data.entryCollection; //structure slug


        console.log("MESSAGE");
        console.log(message.data);

        let favoriteKeyValuePair = {
            entrySlug: entrySlug,
            structureSlug: structureSlug,
            entryCollection: entryCollection
        }

        return allUsers().then((userCollection) => {
            console.log(userCollection);
            return userCollection.update({_id: userId}, {
                $push: {
                    favorites: favoriteKeyValuePair
                }
            }).then((response) => {
                console.log(response);
                if(!response) {
                    let warning = "Could not favorite entry";
                    redisConnection.emit(failedEvent, {
                        requestId: requestId,
                        data: warning,
                        eventName: eventName
                    });
                }
                let message = "Favorited Entry";
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: message,
                    eventName: eventName
                });                    
            });
        });
    });
        

    redisConnection.on("retrieve-userData:get:*", (message, channel) => {
        
        let requestId = message.requestId;
        let eventName = message.eventName;

        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;

        console.log("You have reached retrieve-userData:get");
    
        let user = message.data.username;
        let userId = message.data.userId;

        console.log("MESSAGE");
        console.log(message.data);

        users.getUserById(userId).then((user) => {
            if(!user) {
                let warning = "Could not find user";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });        
            }

            let userReturnPayload = {
                id: user._id,
                username: user.username,
                favorites: user.favorites
            }
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: userReturnPayload,
                eventName: eventName
            });                    
        });
    });
        
        