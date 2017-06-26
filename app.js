const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const path = require("path");

const game = require("./models/Game");
//Express App Initialization
const app = express();

//Public Directory Setup
app.use(express.static(path.join(__dirname, "public")));
//Mustache View Engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
//Body Parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(expressValidator());
//Express Session Initialization
app.use(session({
  secret: "jshgvblzkjsdjkfghailsbegl",
  resave: false,
  saveUninitialized: false
}));

app.get("/", function(req, res) {
  if (req.session.userInfo) {
    if (!game.correctlyGuess()) {
      if (req.session.userInfo.guessesRemain > 0){
        res.render("index", req.session.userInfo);
      }  else {
        res.render("gameOver", req.session.userInfo);
      }
    } else {
      res.render("gameWin",req.session.userInfo);
    }
  } else {
    res.redirect("/gameStart");
  }
});

app.post("/", function(req, res) {
  req.session.userInfo = game.guess(req.session.userInfo, req.body.guess);
  res.redirect("/");
});

app.get("/gameStart", function(req, res) {
  res.render("gameStart");
});

app.post("/gameStart", function(req, res) {
  req.session.userInfo = game.start(req.body.gameMode);
  res.redirect("/");
});

app.post("/HoF", function (req,res) {
  let name = req.body.name;
  game.win(name);
  res.redirect("/Winners");
});

app.get("/Winners",function (req,res) {
  let winners = game.winners();
  res.render("Winners", {"winners":winners});
});

app.listen(3000, function() {
  console.log("server running on localhost:3000");
});
