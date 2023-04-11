const path = require('path');

const userRoutes = require("./users");
const homePageRoutes = require("./homePage");

const constructorMethod = app => 
{
    app.use("/users", userRoutes);
    app.use("/homePage", homePageRoutes);
    
    app.get('/', (req, res) => 
    {
        res.redirect('http://localhost:3000/homePage');
    });

    app.use("*", (req, res) => 
    {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
