const mongoCollections = require('../config/mongoCollections');
const photos = mongoCollections.photos;
ObjectId = require('mongodb').ObjectID;

async function storePhoto(clientName, staffName, locationAddress, photos) {

    let photoCollection = await photos();

    const result = {
      clientName,
      staffName,
      locationAddress,
      photos: {
        data: photos.data,
        contentType: photos.mimetype,
      }
    };

    let insertInfo = await photoCollection.insertOne(result);

    if (insertInfo.insertedCount === 0)
    {
        throw 'Error: Form insertion failed';
    }

    let newId = insertInfo.insertedId;
    let finalPost = await getphotosById(newId.toHexString());

    return finalPost;

}

async function getphotosById(id)
{
    if (!id || typeof id !== "string")
    {
        throw 'Error: ID not provided';
    }
    let photoCollection = await photos();
    let objID = ObjectId.createFromHexString(id);
    let photoFound = await photoCollection.findOne({ _id: objID });

    if (photoFound === null)
    {
        throw 'Error:  not found';
    }
    return photoFound;
}

module.exports = {storePhoto};
