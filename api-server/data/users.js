const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid");
const bcrpyt = require("bcrypt-nodejs");

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
    addUser(username, password, administrator) {
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
                bcrpyt.hash(password, null, null, (err, hash) => {
                    let newUser = {
                        _id: uuid.v4(),
                        username: username,
                        hashedPassword: hash,
                        administrator: administrator
                    };
                    return userCollection.insertOne(newUser).then((insertedInfo) => {
                        return insertedInfo.insertedId;
                    }).then((newId) => {
                        return this.getUserById(newId);
                    });
                });
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