const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;

async function createUser(username, password, nickname) {

}

module.exports = 
{
    createUser
}
