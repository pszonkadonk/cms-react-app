const mongoCollections = require("../config/mongoCollections");
const dbConnection = require("../config/mongoConnection");
const structures = mongoCollections.structures;
const uuid = require("uuid");

let exportedMethods = {
    getAllStructures() {
        return structures().then((structureCollection) => {
            return structureCollection.find({}).toArray();
        });
    },
    getStructureById(id) {
        if(id === "" || typeof(id) === 'undefined') {
            throw("Invalid id provided");
        }
        return structures().then((structureCollection) =>{
            return structureCollection.findOne({_id: id}).then((structure) => {
                if(!structure) {
                    throw "Sorry, structure not found";
                }
                return structure;
            });
        });
    },
    addStructure(name, slug, description, pageSize, fields) {
        console.log("I am in add structure mongodb function");   
        console.log(name);
        console.log(slug);
        console.log(description);
        console.log(pageSize);
        console.log(fields);
        if(name === '' || typeof(name) === 'undefined') {
            console.log("failed in name");
            throw("Name invalid");
        }
        else if(slug === '' || typeof(slug) === 'undefined') {
            console.log("failed in slug");
            throw('You must provide a valid slug');
        }
        else if(typeof(description) === 'undefined') {
            console.log("failed in description");
            throw('You must provide a valid description');
        } 
        else if(pageSize === '' || typeof(pageSize) === 'undefined') {
            console.log("failed in pagesize");
            throw('You must specify a page size');
        }
        else if(fields === '' || typeof(fields) === 'undefined') {
            console.log("failed in fields");
            throw('You must specify fields');
        }
        
        return structures().then((structureCollection) => {
            console.log("I returned structures");
            console.log(structureCollection);
            return structureCollection.findOne({slug: slug}).then((structure) => {
                if(structure) {
                    throw (`The structure with that slug is already in use`);
                }

                let newStructure = {
                    name: name,
                    slug: slug,
                    description: description,
                    pageSize: pageSize,
                    fields: fields
                };
                return structureCollection.insertOne(newStructure).then((insertedInfo) => {
                    return insertedInfo.insertedId;
                }).then((newId) => {
                    return this.getStructureById(newId);
                }).then((createdStructure) => {
                    dbConnection().then(db => {
                        if(db !== "undefined") {
                            db.collection(createdStructure.name).insert({
                                name: createdStructure.name
                            });
                        }
                    });
                }); 
            });
        });
    }
}

module.exports = exportedMethods;