const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const path = require("path");

//Express App Initialization
const app = express();
//Public Directory Setup
app.use(express.static(path.join(__dirname, "public")));
//Mustache View Engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
//Express Session Initialization
app.use(session({
  secret: "jshgvblzkjsdjkfghailsbegl",
  resave: false,
  saveUninitialized: false
}));





app.get("/",function (req,res) {
  console.log("hi");
  res.send("hi");
});

app.listen(3000, function () {
  console.log("server running on localhost:3000");
});
