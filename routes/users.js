const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const validate = require("../helpers");

router
    .route('/signup')
    .get(async(req,res) => {
        let session_exists = req.session.user;

    if (session_exists) 
	{		
		return res.redirect('/homePage');
	}

	res.render('users/signup');
       
    })
