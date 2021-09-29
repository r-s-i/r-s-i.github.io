var score = 0;
var product;
function setUp() {
  var n1 = Math.floor(Math.random()*12);
  n1++;
  var n2 = Math.floor(Math.random()*12);
  n2++;

  document.getElementById("n1").innerHTML = n1;

  document.getElementById("n2").innerHTML = n2;

  document.getElementById("score").innerHTML = score;

  product = n1 * n2;
}

setUp();

/*auto selects the inputfield*/
const inputField = document.getElementById("userInput");
inputField.focus();
inputField.select();

/*checks answer, if correct reloads. updates score depending on answer*/
function checkAnswer() {
  let userInput = document.getElementById("userInput").value;

  if (product == userInput) {
    score++;
    document.getElementById("message").style.visibility = "visible";
    document.getElementById("message").innerHTML = "Correct";
    document.getElementById("score").innerHTML = score;

    inputField.value = "";
    setUp();
  } else {
    score--;

    document.getElementById("score").innerHTML = score;
    document.getElementById("message").style.visibility = "visible";
    document.getElementById("message").innerHTML = "Wrong";

    inputField.value = "";
    setUp();
  }
}

/*Checks if the enterkey (return) is used*/
function isReturnDown() {
  if (event.code == "Enter" || event.keyCode == 13) {
    checkAnswer();
  }
}
