const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid");
const bcrpyt = require("bcrypt-nodejs");
const moment = require('moment');

let exportedMethods = {
        getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        if(id === "" || typeof(id) === 'undefined') {
            throw("Invalid id provided");
        }
        return users().then((userCollection) =>{
            return userCollection.findOne({_id: id}).then((user) => {
                if(!user) {
                    throw "Sorry, user not found";
                }
                return user;
            });
        });
    },
    getUserByUsername(username) {
        if(username === '' || typeof(username) === 'undefined') {
            throw("You have passed an invalid username");
        }
        return users().then((userCollection) => {
            return userCollection.findOne({username: username}).then((user) => {
            if(!user) {
                throw "Sorry, could not find user with that username";
            }
            return user;
            });
        });
    },
    addUser(username, password, administrator, biography) {
        if(username === '' || typeof(username) === 'undefined') {
            throw("Username invalid");
        }
        else if(password === '' || typeof(password) === 'undefined') {
            throw('You must provide a valid password');
        }
        else if(password == '' || typeof(administrator) == 'undefined') {
            throw('You must specify if you would like to be an administrator');
        }
        return users().then((userCollection) => {
            return userCollection.findOne({username: username}).then((user) => {
                if(user) {
                    throw (`The username ${username} is already in use`);
                }
                var hash = bcrpyt.hashSync(password);
                    let newUser = {
                        _id: uuid.v4(),
                        username: username,
                        hashedPassword: hash,
                        administrator: administrator,
                        biography: biography,
                        favorites: [],
                        signupDate: moment().format('MM-DD-YYYY')
                    };
                    return userCollection.insertOne(newUser).then((insertedInfo) => {
                        return insertedInfo.insertedId;
                    }).then((newId) => {
                        return this.getUserById(newId);
                    });
            });
        })
    },
    updateUser(username) {
        return users().then((userCollection) =>{
            return userCollection.updateOne({username: username}, {$set: {administrator: !this.administrator}}).then(() => {
                return this.getUserByUsername(username);
            });
        });
    },
    removeUser(id) {
        if(id === '' || typeof(id) === 'undefined') {
            throw("You must provide a valid id");
        }
        return users().then((userCollection) => {
            return userCollection.removeOne({_id: id}).then((deletedInfo) => {
                if(deletedInfo.deletedCount === 0) {
                    throw("Could not find user with that id");
                }
            });
        });
    }
}

module.exports = exportedMethods;