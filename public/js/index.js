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
    console.log(info);
  });
});

subBtn.addEventListener("click", function(e) {
  e.preventDefault();
  input.value = input.value.toLowerCase();
  if (input.value.length > 1 || input.value.length === 0) {
    input.value = "";
    error.innerText = "Please enter a single character";
  } else {
    if (isAlpha(input.value)){
      document.querySelector("form").submit();
    } else {
      input.value = "";
      error.innerText = "Please enter a single character";
    }
  }
});

//checks
function isAlpha(str) {
  let charCode = str.charCodeAt(0);
  return 65 <= charCode && charCode <= 90;
}
