const path = require('path');

const allRoutes = require("./allroutes");

const constructorMethod = app => 
{
    app.use("/", allRoutes);
    
    
    app.get('/', (req, res) => 
    {
        res.redirect('http://localhost:3000/');
    });

    app.use("*", (req, res) => 
    {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
