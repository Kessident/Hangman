const tries = document.querySelector(".tries");
const guesses = document.querySelector(".guesses");

let info;
fetch("/getInfo").then(function (response) {
  response.json().then(function (data) {
    info = data;
    tries.innerText = info.guessedLetters.length;
    guesses.innerText = info.guesses;
  });
});
