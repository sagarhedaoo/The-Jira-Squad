const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user;
ObjectId = require("mongodb").ObjectID;

async function createUser(fname, lname, email, password, nickname) {
  try{
 

  //Error Checking
  console.log("aaya idhar")
  if (!fname || typeof(fname) !== "string") {
    throw "Error: First Name not provided";
  }
  if (!lname || typeof(lname) !== "string") {
    throw "Error: Last Name not provided";
  }

  if (!password || typeof(password) !== "string") {
    throw "Error: Password not provided";
  }
  if (!email || typeof(email) !== "string") {
    throw "Error: email not provided";
  }

  if (!nickname || typeof(nickname) !== "string") {
    throw "Error: Display name not provided";
  }

  const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  if (
    nickname.match("[a-zA-Z]") === null ||
    nickname.match(regex) != null ||
    nickname.length < 2
  ) {
    throw "Error : Display Name must contain more than two characters and should not include any numbers or special charaters";
  }

  const userCollection = await users();
  let Dupe_exists = await userCollection.findOne({ email: email });

  if (Dupe_exists !== null) {
    throw "Error: Username exists";
  }

 

  let newUser = {
    firstName: fname,
    lastName: lname,
    email:email,
    password: password,
    userName: nickname
  };

  const newInsertInformation = await userCollection.insertOne(newUser);

  if (newInsertInformation.insertedCount === 0) {
    throw "Error: Insertion failed";
  }

  return await this.getUserById(newInsertInformation.insertedId);

}
catch(e){
  console.log(e);

}
}


async function getAllUsers() {
  const userCollection = await users();
  const allUsersList = await userCollection.find({}).toArray();

  return allUsersList;
}

async function getUserById(userId) {
  const userCollection = await users();

  if (typeof(userId) == "string") {
    const objId = ObjectId.createFromHexString(userId);
    userId = objId;
  }

  const user = await userCollection.findOne({ _id: userId });

  if (!user) {
    throw "Error: Cannot find the User";
  }

  return user;
}

async function editPassword(userId, password) {
  if (!userId || typeof userId !== "string") {
    throw "Error: User ID not provided";
  }

  if (!password || typeof password !== "string") {
    throw "Error: Password not provided";
  }

  let userObjId = ObjectId.createFromHexString(userId);

  let userCollection = await users();
  let userUpdateInfo = {
    password: password,
  };

  let updatedInfo = await userCollection.updateOne(
    { _id: userObjId },
    { $set: userUpdateInfo }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw "Error: Password updation failed";
  }

  return this.getUserById(userId);
}

async function editUsername(userId, username) {
  let tempUsername = username.toLowerCase();

  if (!userId || typeof userId !== "string") {
    throw "Error: User ID not provided";
  }

  

  let userObjId = ObjectId.createFromHexString(userId);

  let userCollection = await users();
  let usernameFound = await userCollection.findOne({ username: tempUsername });

  if (usernameFound) {
    throw "Error: Username exists";
  } else {
    let userUpdateInfo = {
      username: tempUsername,
    };

    let updatedInfo = await userCollection.updateOne(
      { _id: userObjId },
      { $set: userUpdateInfo }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw "Error: Username updation failed";
    }

    return this.getUserById(userId);
  }
}

async function editNickname(userId, nickname) {
  if (!userId || typeof userId !== "string") {
    throw "Error: User ID not provided";
  }

  if (!nickname || typeof nickname !== "string") {
    throw "Error: Display name not provided";
  }

  let userObjId = ObjectId.createFromHexString(userId);

  let userCollection = await users();
  let displaynameFound = await userCollection.findOne({ nickname: nickname });

  if (displaynameFound) {
    throw "Error: Display name exists";
  } else {
    let userUpdateInfo = {
      nickname: nickname,
    };

    let updatedInfo = await userCollection.updateOne(
      { _id: userObjId },
      { $set: userUpdateInfo }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw "Error: Display name updation failed";
    }

    return this.getUserById(userId);
  }
}

async function setAdminAccess(userId) {
  if (!userId || typeof userId !== "string") {
    throw "Error: User ID not provided";
  }

  let userObjId = ObjectId.createFromHexString(userId);

  let userCollection = await users();

  let userUpdateInfo = {
    Admin: true,
  };

  let updatedInfo = await userCollection.updateOne(
    { _id: userObjId },
    { $set: userUpdateInfo }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Error: Admin access failed";
  }

  return this.getUserById(userId);
}

// async function addtaskToUser(userId, tasktId) {
//   const userCollection = await users();
//   const updateInfo = await userCollection.updateOne(
//     { _id: ObjectId(userId) },
//     { $addToSet: { posts: postId } }
//   );

//   if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
//     throw "Error: Updation failed";
//   }

//   return await this.getUserById(userId);
// }

// async function removePostFromUser(userId, postId) {
//   const userCollection = await users();
//   const updateInfo = await userCollection.updateOne(
//     { _id: ObjectId(userId) },
//     { $pull: { posts: postId } }
//   );

//   if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
//     throw "Error: Updation failed";
//   }

//   return await this.getUserById(userId);
// }

module.exports = {
  createUser,
  getUserById,
  getAllUsers
};
