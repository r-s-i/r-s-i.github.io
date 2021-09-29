function getRandomNum() {
  let x = document.getElementById("x-num").value;
  let y = document.getElementById("y-num").value;
  x = parseInt(x);
  y = parseInt(y);

  /*Checks what is greater (x or y), and then uses the appropriate formula to get a random number*/
  if (x > y) {
    var randomNum = y + Math.floor(Math.random()*(x-y+1));
  } else {
    var randomNum = x + Math.floor(Math.random()*(y-x+1));
  }

  /*Checks if return value is a number,
  and if it isn't ask the user to use numbers*/
  if (Number.isInteger(randomNum) == true) {
    document.getElementById("result").innerHTML = randomNum;
  } else {
    document.getElementById("result").innerHTML = "Please write a number in both input fields."
  }
}

/*Checks if the enterkey (return) is used*/
function isReturnDown() {
  if (event.code == "Enter" || event.keyCode == 13) {
    getRandomNum();
  }
}

/*To fix onclick problem in ios:*/
let btn = document.querySelector("button");
btn.addEventListener("click", function() {
  getRandomNum();
});
