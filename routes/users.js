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
    .post(async (req, res) => {
        try {

            if (req.session.user) {
                res.status(400).json("You are already loggedIn why sign up again?????");

            }
            else {
                const { username,nickname,password} = req.body;
	try
	{
		if (!username) throw `You must provide a username`;
		
		if (!nickname) throw `You must provide a nickname`;
		
		if (!password[0]) throw `You must provide a password`;
		
		if (!password[1]) throw `You must provide a confirm password`;
		
		if(password[0]!=password[1]) throw `Password don't match`;

        //error check for password

        if(password.length === 0)
        {
        throw "Error : Please enter the password";
        }
        else if(password.length<3)
        {	
        throw "Error : Password must be atleast of 3 characters";
        }
        else if(password.length>20)
        {
        throw "Error : Password must not be more than 20 characters";
        }
        else
        {
            const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

        if((password.match("[a-zA-Z0-9]" === null) || (password.match(regex) === null)))
        {
            throw `Error : Password must contain atleast one capital letter, a number and a special character`;
        }
        }	
        const hash = await bcrypt.hash(password[0], saltRounds);
		const newUser = await userData.createUser(username,hash,nickname);

		loggedOrNot = newUser._id.toHexString(); 

        return res.redirect('/homePage');
    }
    catch (e) {
        console.log(e)
        if (e == "Error: A name, username and password is required for signup") { res.status(400).json(e) }
        if (e == 'Error: Insertion failed') { res.status(500).json(e) }
        //if (e == 'Error: Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.') { res.status(400).json(e) }
        if(e == "Error: Invalid Input.") { res.status(400).json(e)}
        else {
            res.status(400).json(e)
        }
    }}}
});