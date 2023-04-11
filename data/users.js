const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;


async function createUser(username, password, nickname) 
{ 
    let tempUsername = username.toLowerCase(); 
    
    //Error Checking

    if (!tempUsername || typeof tempUsername !== "string") 
    {
        throw 'Error: Username not provided'; 
    }

    if (!password || typeof password !== "string") 
    {
        throw 'Error: Password not provided'; 
    }

    if (!nickname || typeof nickname !== "string") 
    {
        throw 'Error: Display name not provided'; 
    }
        
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

    if((nickname.match("[a-zA-Z]") === null) || (nickname.match(regex) != null) || (nickname.length<2))
    {
        throw "Error : Display Name must contain more than two characters and should not include any numbers or special charaters";
    }

    /*if(password.length === 0)
    {
        throw "Error : Please enter the password";
    }
    else if(password.length<3)
    {
        throw "Error : Password must be between 3 to 20 characters";
    }
    else if(password.length>20)
    {
        throw "Error : Password must be between 3 to 20 characters";
    }
    else
    {
        const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        
        if((password.match("[a-zA-Z0-9]" === null) || (password.match(regex) === null)))
        {
            throw `Error : Password must contain atleast one capital letter, a number and a special character`;
        }
        
    }*/

    const userCollection = await users();
    let usernameFound = await userCollection.findOne({ username: tempUsername }); 

    if (usernameFound !== null) 
    {
        throw 'Error: Username exists'; 
    }

    let displaynameFound = await userCollection.findOne({ nickname: nickname }); 

    if (displaynameFound !== null)
    {
        throw 'Error: Display name exists'; 
    }
        
    let newUser = 
    {
        username: tempUsername,  
        password: password, 
        nickname: nickname,  
        posts: [], 
        comments: [], 
        Admin: false
    };

    const newInsertInformation = await userCollection.insertOne(newUser);

    if (newInsertInformation.insertedCount === 0) 
    {
        throw 'Error: Insertion failed';
    }

    return await this.getUserById(newInsertInformation.insertedId);
};

async function getAllUsers() 
{
    const userCollection = await users();
    const allUsersList = await userCollection.find({}).toArray();

    return allUsersList;
};

async function getUserById(userId) 
{ 
    const userCollection = await users();

    if (typeof userId == "string") 
    {
        const objId = ObjectId.createFromHexString(userId);
        userId = objId;
    }

    const user = await userCollection.findOne({ _id: userId });

    if (!user) 
    {   
        throw 'Error: Cannot find the User'; 
    }
       
    return user;
};

async function editPassword(userId, password) 
{
    if (!userId || typeof userId !== "string")
    {
        throw 'Error: User ID not provided';
    }
         
    if (!password || typeof password !== "string")
    {
        throw 'Error: Password not provided';
    }

    let userObjId = ObjectId.createFromHexString(userId);

    let userCollection = await users();
    let userUpdateInfo = 
    {
        password: password
    };

    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    
    if (updatedInfo.modifiedCount === 0) 
    {
        throw 'Error: Password updation failed'; 
    }

    return this.getUserById(userId);
};

async function editUsername(userId, username) 
{
    let tempUsername = username.toLowerCase(); 

    if (!userId || typeof userId !== "string")
    {
        throw 'Error: User ID not provided';
    }

    if (!tempUsername || typeof tempUsername !== "string")
    {
        throw 'Error: Username not provided';
    }

    let userObjId = ObjectId.createFromHexString(userId);

    let userCollection = await users();
    let usernameFound = await userCollection.findOne({ username: tempUsername }); 

    if (usernameFound) 
    {
        throw 'Error: Username exists'; 
    }   
    else 
    {
        let userUpdateInfo = 
        {
            username: tempUsername
        };

        let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });

        if (updatedInfo.modifiedCount === 0) 
        {
            throw 'Error: Username updation failed'; 
        }
        
        return this.getUserById(userId);
    }
};

async function editNickname(userId, nickname) 
{
    if (!userId || typeof userId !== "string")
    {
        throw 'Error: User ID not provided'; 
    }

    if (!nickname || typeof nickname !== "string")
    {
        throw 'Error: Display name not provided';
    }

    let userObjId = ObjectId.createFromHexString(userId);

    let userCollection = await users();
    let displaynameFound = await userCollection.findOne({ nickname: nickname }); 

    if (displaynameFound) 
    {
        throw 'Error: Display name exists'; 
    }
    else 
    {
        let userUpdateInfo = 
        {
            nickname: nickname
        };

        let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });

        if (updatedInfo.modifiedCount === 0) 
        {
            throw 'Error: Display name updation failed'; 
        }

        return this.getUserById(userId);
    }
};

async function setAdminAccess(userId) 
{
    if (!userId || typeof userId !== "string")
    {
        throw 'Error: User ID not provided';
    }
         
    let userObjId = ObjectId.createFromHexString(userId);

    let userCollection = await users();

    let userUpdateInfo = 
    {
        Admin:true
    };

    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) 
    {
        throw 'Error: Admin access failed'; 
    }

    return this.getUserById(userId);
};


async function addPostToUser(userId, postId) 
{ 
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $addToSet: { posts: postId } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) 
    {
        throw 'Error: Updation failed';
    }

    return await this.getUserById(userId);
};

async function removePostFromUser(userId, postId) 
{ 
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $pull: { posts: postId } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) 
    {
        throw 'Error: Updation failed'; 
    }

    return await this.getUserById(userId);
};


module.exports = 
{
    createUser,
    getUserById,
    getAllUsers,
    editUsername,
    editPassword,
    editNickname,
    addPostToUser,
    removePostFromUser,
    setAdminAccess
}
