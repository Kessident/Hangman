const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const jsonFile = require("jsonfile");

//Word List
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

//Express App Initialization
const app = express();

//Winner File
let file = "winners.json";
let winners = [];
jsonFile.readFile(file,function (err, obj) {
  winners = obj.winners;
});

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

//Object tracking play info
let userInfo = {
  chosenWord: [],
  guessedLetters: [],
  correctLetters: [],
  guessesRemain: 8,
  guesses:0,
  word:""
};

function correctlyGuessed(session) {
  let guessed = true;
  for (var i = 0; i < session.userInfo.chosenWord.length; i++) {
    if (!session.userInfo.chosenWord[i].guessed) {
      guessed = false;
    }
  }
  return guessed;
}

app.get("/", function(req, res) {
  if (req.session.userInfo) {
    if (!correctlyGuessed(req.session)) {
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
  let guess = req.body.guess;
  let goodGuess = false;
  //If guesses remain
  if (req.session.userInfo.guessesRemain > 0) {
    //guessed before
    if (req.session.userInfo.guessedLetters.indexOf(guess) === -1) {
      req.session.userInfo.guessedLetters.push(guess);
    } else {
      goodGuess = true;
      req.session.userInfo.guesses++;
    }
    //checks if guessed letter is in chosenWord
    for (let i = 0; i < req.session.userInfo.chosenWord.length; i++) {
      if (guess === req.session.userInfo.chosenWord[i].letter) {
        if (req.session.userInfo.correctLetters.indexOf(guess) === -1) {
          req.session.userInfo.correctLetters.push(guess);
        }
        req.session.userInfo.chosenWord[i].guessed = true;
        goodGuess = true;
      }
    }
    //Guessed letter is not in chosenWord
    if (!goodGuess){
      req.session.userInfo.guessesRemain--;
    }
    res.redirect("/");
  }
});

app.get("/gameStart", function(req, res) {
  req.session.userInfo = {
    chosenWord: [],
    guessedLetters: [],
    correctLetters: [],
    guessesRemain: 8,
    guesses:0,
    word: ""
  };
  res.render("gameStart", req.session.userInfo);
});

app.post("/gameStart", function(req, res) {
  let lowerLimit, upperLimit;

  if (req.body.gameMode === "easy") {
    lowerLimit = 4;
    upperLimit = 6;
  } else if (req.body.gameMode === "medium") {
    lowerLimit = 6;
    upperLimit = 8;
  } else {
    lowerLimit = 8;
    upperLimit = 20;
  }

  let index = 0;

  let found = false;
  do {
    req.session.userInfo.word = words[Math.floor(Math.random() * words.length)];
    let len = req.session.userInfo.word.length;
    if (lowerLimit <= len && len <= upperLimit){
      found = true;
    }
    index++;
  } while (!found);

  for (var i = 0; i < req.session.userInfo.word.length; i++) {
    req.session.userInfo.chosenWord.push({
      "letter": req.session.userInfo.word.charAt(i),
      "guessed": false
    });
  }
  res.redirect("/");
});

app.post("/HoF", function (req,res) {
  let name = req.body.name;
  let newWin = {
    "name": name,
    "word": req.session.userInfo.word,
    "guesses": req.session.userInfo.guesses
  };
  winners.push(newWin);
  jsonFile.writeFile(file,{"winners":winners});
  res.redirect("/Winners");
});

app.get("/Winners",function (req,res) {
  res.render("Winners", {"winners":winners});
});

app.listen(3000, function() {
  console.log("server running on localhost:3000");
});
