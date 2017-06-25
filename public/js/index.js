const subBtn = document.querySelector("button");
const input = document.querySelector("input");
const error = document.querySelector(".error");

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
  return 97 <= charCode && charCode <= 122;
}
