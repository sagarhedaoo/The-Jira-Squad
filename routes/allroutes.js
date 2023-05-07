const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcryptjs");
const saltRounds = 5;
const userData = data.users;
const photoData = data.photos;
const taskData = data.tasks;
//const multer = require('multer');

router.get("/tasks", async (req, res) => {
  res.render("tasks");
});

router.post("/tasks", async (req, res) => {


  let task = req.body
  let userid = req.session.id
  
  const task_added = tasks.createTask(task,userid);

  const alltasks = tasks.getAllTasks();


  res.render("tasks",{alltasks});
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
    res.render("./home.handlebars", { userLogin });
  } catch (error) {
    res.render("./signin.handlebars");
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

    res.render("/home.handlebars", { postArr, userLogin });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/account", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (!loggedOrNot) {
    return res.redirect("/");
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
      nickname: loggedUser.nickname,
      "post-list": posts,
      loggedUser,
    });
  } catch (e) {
    res.status(404).json({ error: "Error : No User Found" });
  }
});

// router.get("/signin", async (req, res) => {
//   let loggedOrNot = req.session.userId;

//   if (loggedOrNot) {
//     return res.redirect("signin2");
//   }
//   res.render("signin2");
// });

router.get("/signin", function (req, res) {
  res.render("./signin.handlebars");
});

router.post("/signin", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (loggedOrNot) {
    return res.redirect("/");
  }

  
  const { email, password } = req.body;
  const allUser = await userData.getAllUsers();

  for (i = 0; i < allUser.length; i++) {
    if (email.toLowerCase() == allUser[i].email) {
      if (await bcrypt.compare(password, allUser[i].password)) {
        req.session.userId = allUser[i]._id.toHexString();
        break;
      }
      return res.redirect("/");
    }
  else{
  res.status(401).render("./signin.handlebars", {
    message: "Error : Credentials do not match. No Account? Register now!",
  });
}}
});

router.get("/signup", async (req, res) => {
  loggedOrNot = req.session.userId;
console.log("get mein to aa ja!!!!!")
  if (loggedOrNot) {
    return res.redirect("/");
  }

  res.render("./signup.handlebars");
});

router.post("/signup", async (req, res) => {
  let loggedOrNot = req.session.userId;
  if(loggedOrNot){
    res.redirect("/")
  }

  const { fname, lname, email, nickname, password , confirm_password,} = req.body;
  console.log("chu aaya ki nai????????",fname)
  try {
    if (!fname) {
    throw `You must provide a First Name.`;
  }
    if (!lname) {
      throw `You must provide a Last Name.`;
    }
    if (!email) {
      throw `You must provide an email.`;
    }
    if (!nickname) {
      throw `You must provide a nickname.`;
    }
    if (!password) {
      throw `You must provide a password.`;
    }
    if (!confirm_password) {
      throw `You must provide a confirm password.`;
    }
    if (password != confirm_password) {
      throw `Password don't match`;
    }

    //error check for password

    if (password.length === 0) {
      throw "Error : Please enter the password";
    } else if (password.length < 3) {
      throw "Error : Password must be atleast of 3 characters";
    } else if (password.length > 20) {
      throw "Error : Password must not be more than 20 characters";
    } else {
      const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

      if (
        password.match("[a-zA-Z0-9]" === null) ||
        password.match(regex) === null
      ) {
        throw `Error : Password must contain atleast one capital letter, a number and a special character`;
      }
    }
  console.log("routes mein aaya")
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await userData.createUser(fname, lname, email, hash, nickname);

    loggedOrNot = newUser._id.toHexString();

    return res.redirect("/");
  } catch (e) {
    res.status(404).render("signup", { message: e });
  }
});

router.get("/signout", async (req, res) => {
  let loggedOrNot = req.session.userId;

  if (!loggedOrNot) {
    return res.redirect("/");
  }

  req.session.destroy();

  return res.redirect("/");
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

router.get("/contracts", async (req, res) => {
  try {
    let userLogin = null;
    if (req.session) {
      if (req.session.userId) {
        userLogin = await userData.getUserById(req.session.userId);
      }
    }
    res.render("photoForm");
  } catch (e) {
    res.redirect("/");
  }
});

// Set up a POST route to handle form submissions
router.post("/contracts", async (req, res) => {
  const { clientName, staffName, locationAddress } = req.body;
  console.log("routes pohoch gaye", req.body.clientName);
  const photos = req.body.photos;
 
  // Do something with the form data and photos here
  const result = await photoData.storePhoto(
    clientName,
    staffName,
    locationAddress,
    photos
  );

  res.render("photo",result);
});
module.exports = router;
