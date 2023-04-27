const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcryptjs");
const saltRounds = 5;
const userData = data.users;
const photoData = data.photos;

router.get("/tasks", async (req, res) => {
  res.render("tasks.handlebars");
});

router.post("/tasks", async (req, res) => {
  res.render("home.handlebars");
});

router.delete("/tasks", async (req, res) => {
  const id = req.params.id;
  if (id >= 0 && id < todos.length) {
    todos.splice(id, 1);
    res.json(todos);
  } else {
    res.status(400).json({ error: "Invalid todo ID" });
  }
});

router.get("/", async (req, res) => {
  try {
    let userLogin = null;

    if (req.session) {
      if (req.session.userId) {
        userLogin = await userData.getUserById(req.session.userId);
      }
    }
    res.render("home.handlebars", { userLogin });
  } catch (error) {
    res.render("signin.handlebars");
  }
});

router.get("/search", async (req, res) => {
  try {
    let userLogin = null;

    if (req.session) {
      if (req.session.userId) {
        userLogin = await userData.getUserById(req.session.userId);
      }
    }

    if (!req.query) {
      throw "Error : No String Given";
    }

    if (!req.query.searchString) {
      throw "Error : No String Given";
    }

    let postArr = await postData.getPostByString(req.query.searchString);

    res.render("home/home.handlebars", { postArr, userLogin });
  } catch (error) {
    res.redirect("/homePage");
  }
});

router.get("/account", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (!loggedOrNot) {
    return res.redirect("/homePage");
  }

  try {
    const userID = req.session.userId;
    const loggedUser = await userData.getUserById(userID);

    let posts = [];

    for (i = 0; i < loggedUser.posts.length; i++) {
      const eachPost = await postData.getPostById(loggedUser.posts[i]);
      posts.push(eachPost);
    }

    res.render("useraccount", {
      username: loggedUser.username,
      nickname: loggedUser.nickname,
      "post-list": posts,
      loggedUser,
    });
  } catch (e) {
    res.status(404).json({ error: "Error : No User Found" });
  }
});

router.get("/signin", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (loggedOrNot) {
    return res.redirect("/homePage");
  }
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (loggedOrNot) {
    return res.redirect("/homePage");
  }

  const { username, password } = req.body;
  const allUser = await userData.getAllUsers();

  for (i = 0; i < allUser.length; i++) {
    if (username.toLowerCase() == allUser[i].username) {
      if (await bcrypt.compare(password, allUser[i].password)) {
        req.session.userId = allUser[i]._id.toHexString();

        return res.redirect("/homePage");
      }

      break;
    }
  }
  res.status(401).render("signin", {
    message: "Error : Credentials do not match. No Account? Register now!",
  });
});

router.get("/signup", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (loggedOrNot) {
    return res.redirect("/homePage");
  }

  res.render("signup");
});

router.post("signup", async (req, res) => {
  let loggedOrNot = req.session.userId;

  const { username, nickname, password } = req.body;
  try {
    if (!username) {
      throw `You must provide a username`;
    }
    if (!nickname) {
      throw `You must provide a nickname`;
    }
    if (!password[0]) {
      throw `You must provide a password`;
    }
    if (!password[1]) {
      throw `You must provide a confirm password`;
    }
    if (password[0] != password[1]) {
      throw `Password don't match`;
    }

    //error check for password

    if (password[0].length === 0) {
      throw "Error : Please enter the password";
    } else if (password[0].length < 3) {
      throw "Error : Password must be atleast of 3 characters";
    } else if (password[0].length > 20) {
      throw "Error : Password must not be more than 20 characters";
    } else {
      const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

      if (
        password[0].match("[a-zA-Z0-9]" === null) ||
        password[0].match(regex) === null
      ) {
        throw `Error : Password must contain atleast one capital letter, a number and a special character`;
      }
    }

    const hash = await bcrypt.hash(password[0], saltRounds);
    const newUser = await userData.createUser(username, hash, nickname);

    loggedOrNot = newUser._id.toHexString();

    return res.redirect("/homePage");
  } catch (e) {
    res.status(404).render("/users/signup", { message: e });
  }
});

router.get("/signout", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (!loggedOrNot) {
    return res.redirect("/homePage");
  }

  req.session.destroy();

  return res.redirect("/homePage");
});

router.post("/account", async (req, res) => {
  let { username, password, Cpassword, nickname } = req.body;

  let loggedOrNot = req.session.userId;

  let oldUser;
  let posts = [];

  try {
    oldUser = await userData.getUserById(loggedOrNot);
  } catch (e) {
    res.status(404).json({ error: "Error : No User Found" });
    return;
  }

  try {
    let success1;
    let success2;
    let success3;

    if (username == oldUser.username) {
      throw "un";
    }

    if (password == oldUser.password) {
      throw "sp";
    }

    if (password != Cpassword) {
      throw "pdm";
    }

    if (nickname == oldUser.nickname) {
      throw "dd";
    }

    if (username) {
      await userData.editUsername(loggedOrNot, username);

      success1 = "Username Updated";
    } else if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      await userData.editPassword(loggedOrNot, hash);

      success3 = "Password Updated";
    } else if (nickname) {
      await userData.editNickname(loggedOrNot, nickname);

      success2 = "Display Name Updated";
    } else {
      throw `di`;
    }

    /*if(password.length === 0)
   		{
        	throw "Error : Please enter the password";
    	}
    	else if(password.length<3)
    	{	
        	throw "three";
    	}
    	else if(password.length>20)
    	{
        	throw "20";
    	}
    	else
    	{
       		const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        
        	if((password.match("[a-zA-Z0-9]" === null) || (password.match(regex) === null)))
        	{
            	throw `a9`;
        	}
    	}	*/

    let updatedUser = await userData.getUserById(loggedOrNot);

    let eachUsersPost = updatedUser.posts;

    for (i = 0; i < eachUsersPost.length; i++) {
      const eachPost = await postData.getPostById(eachUsersPost[i]);

      posts.push(eachPost);
    }

    res.render("useraccount", {
      username: updatedUser.username,
      nickname: updatedUser.nickname,
      "post-list": posts,
      success1: success1,
      success2: success2,
      success3: success3,
      loggedUser: updatedUser,
    });
  } catch (e) {
    let message1;
    let message2;
    let message3;
    let message4;

    if (e == "un") {
      message1 = "Error : Submit Different Username";
    }

    if (e == "Error: Username exists") {
      message1 = "Error: Username exists";
    }

    if (e == "dd") {
      message2 = "Error : Submit Different Displayname";
    }
    if (e == "Error: Display Name exists") {
      message2 = "Error: Display Name exists";
    }
    if (e == "sp") {
      message3 = "Error : Submit Different Password";
    }
    if (e == "pdm") {
      message3 = "Error : Passwords do not match";
    } else if (e == "three") {
      message3 = "Error : Password must be atleast of 3 characters";
    } else if (e == "20") {
      message3 = "Error : Password must not be more than 20 characters";
    } else if (e == "a9") {
      message3 =
        "Error : Password must contain a capital letter, a numerical value and a special character";
    }

    if (e == "di") {
      message4 = "Fill and Submit different inputs";
    }

    const ous = oldUser.username;
    const odn = oldUser.nickname;

    let usersOldPost = oldUser.posts;

    for (i = 0; i < usersOldPost.length; i++) {
      const eachPost = await postData.getPostById(usersOldPost[i]);
      posts.push(eachPost);
    }

    res.status(404).render("useraccount", {
      username: ous,
      nickname: odn,
      "post-list": posts,
      message1: message1,
      message2: message2,
      message3: message3,
      message4: message4,
      loggedUser: oldUser,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const allUsersList = await userData.getAllUsers();

    res.json(allUsersList);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/photo", async (req, res) => {
  try {
    let userLogin = null;

    if (req.session) {
      if (req.session.userId) {
        userLogin = await userData.getUserById(req.session.userId);
      }
    }
    res.render("photoForm.handlebars");
  } catch (e) {
    res.render("home.handlebars");
  }
});

// Set up a POST route to handle form submissions
router.post("/submit", async (req, res) => {
  const { clientName, staffName, locationAddress } = req.body;
  const photos = req.body.photos;
  // Do something with the form data and photos here
  const result = await photoData.storePhoto(
    clientName,
    staffName,
    locationAddress,
    photos
  );

  res.render("photo.handlebars");
});
module.exports = router;
