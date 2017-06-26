const fs = require("fs");
//Word List
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

const jsonFile = require("jsonfile");



//Winner File
let file = "winners.json";
let winners = [];
jsonFile.readFile(file,function (err, obj) {
  winners = obj.winners;
});

//Object tracking play info
let userInfo = {
  chosenWord: [],
  guessedLetters: [],
  correctLetters: [],
  guessesRemain: 8,
  guesses: 0,
  word: ""
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

function guess(info, guess) {
  userInfo = info;
  let badGuess = true;
  //If guesses remain
  if (userInfo.guessesRemain > 0) {
    //guessed before
    if (userInfo.guessedLetters.indexOf(guess) === -1) {
      userInfo.guessedLetters.push(guess);
      userInfo.guesses++;
    } else {
      badGuess = false;
    }
    //checks if guessed letter is in chosenWord
    for (let i = 0; i < userInfo.chosenWord.length; i++) {
      if (guess === userInfo.chosenWord[i].letter) {
        if (userInfo.correctLetters.indexOf(guess) === -1) {
          userInfo.correctLetters.push(guess);
        }
        userInfo.chosenWord[i].guessed = true;
        badGuess = false;
      }
    }
    //Guessed letter is not in chosenWord
    if (badGuess) {
      userInfo.guessesRemain--;
    }
  }
  return userInfo;
}

function gameStart(mode) {
  userInfo = {
    chosenWord: [],
    guessedLetters: [],
    correctLetters: [],
    guessesRemain: 8,
    guesses: 0,
    word: ""
  };

  let lowerLimit, upperLimit;

  if (mode === "easy") {
    lowerLimit = 4;
    upperLimit = 6;
  } else if (mode === "medium") {
    lowerLimit = 6;
    upperLimit = 8;
  } else {
    lowerLimit = 8;
    upperLimit = 20;
  }

  let index = 0;

  let found = false;
  do {
    userInfo.word = words[Math.floor(Math.random() * words.length)];
    let len = userInfo.word.length;
    if (lowerLimit <= len && len <= upperLimit){
      found = true;
    }
    index++;
  } while (!found);

  for (var i = 0; i < userInfo.word.length; i++) {
    userInfo.chosenWord.push({
      "letter": userInfo.word.charAt(i),
      "guessed": false
    });
  }
  return userInfo;
}

function gameWin(name) {
  let newWin = {
    "name": name,
    "word": userInfo.word,
    "guesses": userInfo.guesses
  };
  winners.push(newWin);
  jsonFile.writeFile(file,{"winners":winners});
  return newWin;
}

function getWinners() {
  return winners;
}

module.exports = {
  userInfo: userInfo,
  start: gameStart,
  correctlyGuess: correctlyGuessed,
  guess: guess,
  win: gameWin,
  winners: getWinners
};
