const express = require("express");
const path = require("path")
const router = express.Router();
const formidable = require('formidable');

const data = require("../data");
const userData = data.users;


router.get('/', async (req, res) => 
{
    try 
    {
        let userLogin = null;

        if (req.session) 
        {
            if (req.session.userId)
            {
                userLogin = await userData.getUserById(req.session.userId);
            }
        }

       

        
        
        res.render('home.handlebars', {  userLogin });
    } 
    catch (error) 
    {
        res.redirect('/homePage');
    }
});


router.get('/tag', async (req, res) => 
{
    try 
    {
        let userLogin = null;

        if (req.session) 
        {
            if (req.session.userId)
            {
                userLogin = await userData.getUserById(req.session.userId);
            }
        }

        if (!req.query)
        {
            throw "Error : No information on Tag";
        }
    
        if (!req.query.searchTag)
        {
            throw "Error : No Tag Given";
        }
        
        let postArr = await postData.getPostByOneTag(req.query.searchTag);

        res.render('home/home.handlebars', { postArr, userLogin });
    } 
    catch (error) 
    {
        res.status(404).send(error);
    }
});

router.get("/search", async (req, res) => 
{
    try 
    { 
        let userLogin = null;

        if (req.session) 
        {
            if (req.session.userId)
            {
                userLogin = await userData.getUserById(req.session.userId);
            }      
        }

        if (!req.query)
        {
            throw "Error : No String Given";
        }

        if (!req.query.searchString)
        {
            throw "Error : No String Given";
        }
            
        let postArr = await postData.getPostByString(req.query.searchString);

        res.render('home/home.handlebars', { postArr, userLogin });
    } 
    catch (error) 
    {
        res.redirect('/homePage')
    }
})

router.post('/createPost', async (req, res) => 
{
    let userLogin = null;

    if (req.session) 
    {
        if (req.session.userId)
        {
            userLogin = await userData.getUserById(req.session.userId);
        }
    }

    const form = new formidable.IncomingForm(); //parse form data from the input form

    form.uploadDir = path.join(__dirname, '../', 'public', 'images'); //join the form data with the directory for the images
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => 
    {
        try 
        {
            if (!fields)
            {
                throw "Error : No Data Given";
            }
                
            if (!fields.topic)
            {
                throw "Error : No Title Given";
            }
               
            if (!fields.content)
            {
                throw "Error : No Content Given";
            }
                
            if (!fields.tagArr)
            {
                throw "Error : No Tags Given";
            }

            let tagArr = JSON.parse(fields.tagArr);

            if (!Array.isArray(tagArr))
            {   
                throw "Error : No Tags Given";
            }

            if(tagArr.length === 0)
            {
                throw `Error : Please Provide a Tag before creating the post`;
            }

            let photoArr = []; //add 4 or less pictures

            if (files.photo0)
            {
                photoArr.push("http://localhost:3000/public/images/" + files.photo0.path.split('images\\')[1]);
            }
                
            if (files.photo1)
            {
                photoArr.push("http://localhost:3000/public/images/" + files.photo1.path.split('images\\')[1]);
            }
                
            if (files.photo2)
            {
                photoArr.push("http://localhost:3000/public/images/" + files.photo2.path.split('images\\')[1]);
            }
                
            if (files.photo3)
            {
                photoArr.push("http://localhost:3000/public/images/" + files.photo3.path.split('images\\')[1]); 
            }
            
            let newPost = await postData.createPost
            (
                fields.topic,
                req.session.userId,
                fields.content,
                photoArr,
                tagArr
            )

            res.send(newPost);
        } 
        catch (error) 
        {
            res.status(404).send(error);
        }
    })
});

module.exports = router;