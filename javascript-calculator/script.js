/*set up*/

var display = document.getElementById("display");
var output = document.getElementById("output");

// functions adds the user-selected number
function add1() {
  display.value += 1;
}

function add2() {
  display.value += 2;
}

function add3() {
  display.value += 3;
}

function add4() {
  display.value += 4;
}

function add5() {
  display.value += 5;
}

function add6() {
  display.value += 6;
}

function add7() {
  display.value += 7;
}

function add8() {
  display.value += 8;
}

function add9() {
  display.value += 9;
}

function add0() {
  display.value += 0;
}

function addDot() {
  display.value += ".";
}

function clearDisplay() {
  display.value = "";
}

function addStar() {
  display.value += "*";
}

function addSlash() {
  display.value += "/";
}

function addMinus() {
  display.value += "-";
}

function addPlus() {
  display.value += "+";
}

function getAnswer() {
  output.value = eval(display.value);
  if (output.value == "undefined") {
    output.value = "No input given...";
  } else {
    output.value = eval(display.value).toFixed(9); /* calculates the answer and limit the numbers after the float.*/
  }
}

/*Checks if the enterkey (return) is used*/
function isReturnDown() {
  if (event.code == "Enter" || event.keyCode == 13) {
    getAnswer();
  }
}







