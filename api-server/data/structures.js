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
    getStructureBySlug(slug) {
        if(slug === "" || typeof(slug) === 'undefined') {
            throw("Invalid slug provided");
        }

        return structures().then((structureCollection) => {
            return structureCollection.findOne({slug: slug}).then((structure) => {
                if(!structure) {
                    throw("No structure found");
                }
                return structure
            });
        });  
    },
    addStructure(structure) {
        console.log("I am in add structure mongodb function");
        if(structure.structureName === '' || typeof(structure.structureName) === 'undefined') {
            console.log("failed in name");
            throw("Name invalid");
        }
        else if(structure.structureSlug === '' || typeof(structure.structureSlug) === 'undefined') {
            console.log("failed in slug");
            throw('You must provide a valid slug');
        }
        else if(typeof(structure.structureDescription) === 'undefined') {
            console.log("failed in description");
            throw('You must provide a valid description');
        } 
        else if(structure.structurePageSize === '' || typeof(structure.structurePageSize) === 'undefined') {
            console.log("failed in pagesize");
            throw('You must specify a page size');
        }
        else if(structure.structureFields === '' || typeof(structure.structureFields) === 'undefined') {
            console.log("failed in fields");
            throw('You must specify fields');
        }
        
        return structures().then((structureCollection) => {
            console.log("I returned structures");
            // console.log(structureCollection);
            return structureCollection.findOne({slug: structure.structureSlug}).then((existingStructure) => {
                if(existingStructure) {
                    throw (`The structure with that slug is already in use`);
                }

                let newStructure = {
                    _id: uuid.v4(),
                    name: structure.structureName,
                    slug: structure.structureSlug,
                    description: structure.structureDescription,
                    pageSize: structure.structurePageSize,
                    fields: structure.structureFields
                };
                return structureCollection.insertOne(newStructure).then((insertedInfo) => {
                    return insertedInfo.insertedId;
                }).then((newId) => {
                    return this.getStructureById(newId);
                }).then((createdStructure) => {
                    dbConnection().then(db => {
                        let status;
                        if(db !== "undefined") {
                            status = 1;
                            console.log("about to create new  collection for entries");
                            db.collection(`${createdStructure.slug}-entries`).insert({
                                slug: createdStructure.slug
                            });
                        }
                    });
                }); 
            });
        });
    },
    updateStructure(slug, updatedStructure) {
        return structures().then((structureCollection) => {
            let updateCommand = {
                $set: updatedStructure
            };

            return structureCollection.updateOne({slug: slug}, updateCommand).then(() => {
                return this.getStructureBySlug(slug);
            });
        });
    },

    removeStructure(slug, name) {
        return structures().then((structureCollection) => {
            return structureCollection.removeOne({slug: slug}).then((deletedInfo) => {
                if(deletedInfo.deletedCount === 0) {
                    return Promise.reject(`Could not delete structure with slug ${slug}`);
                }
                return null;
            }).then(() => {
                dbConnection().then(db => {
                    let status;
                    if(db !== "undefined") {
                        status = 1;
                        db.collection(`${slug}-entries`).drop((err, reply) => {
                            if(err) {
                                console.log(err);
                            }
                            console.log(reply);
                        });
                    }
                })
            }).then(() => {
                return null;
            })
        });
    }
}

module.exports = exportedMethods;