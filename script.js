const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

// Serve static files from the public directory
app.use(express.static("public"));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Define the route for the form page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/form.html");
});

// Define the route for form submissions
app.post("/submit-form", upload.array("picture"), function (req, res) {
  const formData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    pictures: req.files.map((file) => file.filename),
  };

  // Save the form data to MongoDB
  const Form = mongoose.model("Form", {
    name: String,
    email: String,
    phone: String,
    message: String,
    pictures: [String],
  });
  const form = new Form(formData);
  form.save(function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving form data");
    } else {
      res.send("Form submitted successfully!");
    }
  });
});

// Start the server
app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
