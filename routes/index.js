const path = require("path");

const allRoutes = require("./allroutes");

const constructorMethod = (app) => {
  app.use("/", allRoutes);

  app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/");
  });

  // Route for the Dashboard page
  app.get("/signin", function (req, res) {
    res.render("http://localhost:3000/signin2"); // assuming you have a dashboard.handlebars file
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
