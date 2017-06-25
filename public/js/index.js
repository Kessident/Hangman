const chosenWord = document.querySelector(".chosenWord");
const subBtn = document.querySelector("button");
const input = document.querySelector("input");
const error = document.querySelector(".error");
let info;
fetch("/getInfo").then(function (response) {
  response.json().then(function (data) {
    info = data;
    for (let i = 0; i < info.chosenWord.length; i ++){
      if (info.chosenWord[i].guessed){
        info.chosenWord.innerText = chosenWord.innerText += info.chosenWord[i].letter + " ";
      } else {
        chosenWord.innerText = chosenWord.innerText + " _";
      }
    }
  });
});

subBtn.addEventListener("click", function(e) {
  e.preventDefault();
  input.value = input.value.toLowerCase();
  if (input.value.length > 1 || input.value.length === 0) {
    input.value = "";
    error.innerText = "Please enter a single letter";
  } else {
    if (isAlpha(input.value)){
      document.querySelector("form").submit();
    } else {
      input.value = "";
      error.innerText = "Please enter a single letter";
    }
  }
});

//checks if character is letter
function isAlpha(str) {
  let charCode = str.charCodeAt();
  return 96 <= charCode && charCode <= 123;
}
