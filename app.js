const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const path = require("path");
const fs = require('fs');

//Word List
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
// let easyWords = [],
//   medWords = [],
//   hardWords = [];
// words.forEach(function(word) {
//   if (4 <= word.length && word.length <= 6) {
//     easyWords.push(word);
//   } else if (6 <= word.length && word.length <= 8) {
//     medWords.push(word);
//   } else if (words.length >= 8) {
//     hardWords.push(word);
//   }
// });

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

//Object tracking play info
let userInfo = {
  chosenWord: [],
  guessedLetters: [],
  correctLetters: [],
  guesses: 8
};

function correctlyGuessed() {
  let guessed = true;
  for (var i = 0; i < userInfo.chosenWord.length; i++) {
    if (!userInfo.chosenWord[i].guessed) {
      guessed = false;
    }
  }
  return guessed;
}

app.get("/", function(req, res) {
  if (userInfo.chosenWord.length > 0) {
    if (!correctlyGuessed()) {
      res.render("index", userInfo);
    } else {
      res.render("gameWin",userInfo);
    }
  } else {
    res.redirect("/gameStart");
  }
});

app.post("/", function(req, res) {
  let guess = req.body.guess;
  let goodGuess = false;
  //If guesses remain
  if (userInfo.guesses > 1) {
    //guessed before
    if (userInfo.guessedLetters.indexOf(guess) === -1) {
      userInfo.guessedLetters.push(guess);
    } else {
      goodGuess = true;
    }
    //checks if guessed letter is in chosenWord
    for (let i = 0; i < userInfo.chosenWord.length; i++) {
      if (guess === userInfo.chosenWord[i].letter) {
        if (userInfo.correctLetters.indexOf(guess) === -1) {
          userInfo.correctLetters.push(guess);
        }
        userInfo.chosenWord[i].guessed = true;
        goodGuess = true;
      }
    }
    //Guessed letter is not in chosenWord
    if (!goodGuess){
      userInfo.guesses--;
    }
    res.redirect("/");
  } else {
    res.render("gameOver", userInfo);
  }
});

app.get("/gameStart", function(req, res) {
  userInfo = {
    chosenWord: [],
    guessedLetters: [],
    correctLetters: [],
    guesses: 8
  };
  res.render("gameStart", userInfo);
});

app.post("/gameStart", function(req, res) {
  let chosenWord;
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
    chosenWord = words[Math.floor(Math.random()*words.length)];
    let len = chosenWord.length;
    if (lowerLimit <= len && len <= upperLimit){
      found = true;
    }
    index++;
  } while (!found);

  for (var i = 0; i < chosenWord.length; i++) {
    userInfo.chosenWord.push({
      "letter": chosenWord[i],
      "guessed": false
    });
  }
  res.redirect("/");
});

//fetch request target
app.get("/getInfo", function(req, res) {
  res.send(userInfo);
});

app.listen(3000, function() {
  console.log("server running on localhost:3000");
});
