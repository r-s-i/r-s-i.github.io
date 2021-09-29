/*Creates shortcut to manipulate the DOM:*/
function pane(paneNum) {
  return document.getElementById(paneNum);
}

/*Arrays to keep track of player and computer selected:*/
var crossArray = [];
var circleArray = [];
var wholeArray = [];
var fullArray = [1,2,3,4,5,6,7,8,9];

/*List over possible number combinations to achieve victory:*/
var winningNumArrays = [[1,2,3], [4,5,6], [7,8,9], [1,5,9], [3,5,7], [1,4,7], [2,5,8], [3,6,9]];

/*Helping functions:*/
/*Takes two arrays and return an array 
with the numbers they don't have in common:*/
function filterOut(arr1, arr2) {
  let arr3 = [];
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      arr3.push(arr1[i]);
    }
  }
  return arr3;
}

/*Selects random number from array:*/
function rNumFromArr(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

/*Translates the arrays to the graphical interface:*/
function toGraphics(arr, pic) {
  for (let i = 0; i < arr.length; i++)
  pane("pane" + arr[i]).style.backgroundImage = `url(${pic})`;
}

// Checks to see if computer is victories:
let cWon = false;
function didComWin() {
  for (let i = 0; i < winningNumArrays.length; i++) {
    let firstNum = winningNumArrays[i][0];
    let secondNum = winningNumArrays[i][1];
    let thirdNum = winningNumArrays[i][2];
    if (circleArray.includes(firstNum) && circleArray.includes(secondNum) && circleArray.includes(thirdNum)) {
      document.getElementById("button").style.visibility = "visible";
      document.getElementById
      ("output-gameover").style.visibility = "visible";
      cWon = true;
    }
  }
} // End of didComWin().

// Checks to see if it is a tie:
function tie() {
  if (circleArray.length >= 5 && !cWon) {
    document.getElementById("button").style.visibility = "visible";
    document.getElementById("output-tie").style.visibility = "visible";
  }
}

/*Checks to see if player or computer have one left   
and acts accordingly:*/
function haveOneLeft(arr) {
  for (let i = 0; i < winningNumArrays.length; i++) {
    let firstNum = winningNumArrays[i][0];
    let secondNum = winningNumArrays[i][1];
    let thirdNum = winningNumArrays[i][2];
    if (arr.includes(firstNum) && arr.includes(secondNum) && !wholeArray.includes(thirdNum)) {
      cNum = thirdNum;
    }
    if (arr.includes(firstNum) && arr.includes(thirdNum) && !wholeArray.includes(secondNum)) {
      cNum = secondNum;
    }
    if (arr.includes(secondNum) && arr.includes(thirdNum) && !wholeArray.includes(firstNum)) {
      cNum = firstNum;
    }
  } // End of for loop.
} // End of haveOneLeft().

/*Main functions:*/
function player(uNum) {
  /*Stops the player from overwriting a pane:*/
  if (wholeArray.includes(uNum)) {
    return;
  }
  /*Stops the game when the game is over:*/
  if (cWon === true) {
    return;
  }
  crossArray.push(uNum);
  wholeArray.push(uNum);
  computer();
  /*Shows output information to the player*/
  showOutput();
  toGraphics(crossArray, 'cross-200.png');
  toGraphics(circleArray, 'circle-200.png');
} // End of player().

function computer() {
  /*Check to see if 5 is taken, and if it's not the computer selects it:*/
  if (!wholeArray.includes(5)) {
    cNum = 5;
  } 
  /*If player choose 5, select either 1, 3, 7, or 9:*/
  else {
    cNum = rNumFromArr([1,3,7,9]);
  }
  /*Blocks if player have two in a row, 
  if computer have two, it prioritizes getting three:*/
  /*Does the player have one left?:*/
  haveOneLeft(crossArray);
  /*Does the player have one left?:*/
  haveOneLeft(circleArray);
  
/*Makes sure not to select an unavailable pane:*/
if (wholeArray.includes(cNum)) {
  cNum = rNumFromArr(filterOut(fullArray, wholeArray));
}

/*Adds the computer's number to crossArray and wholeArray:*/
circleArray.push(cNum)
wholeArray.push(cNum)
} // End of computer().

/*Shows output information to the player:*/
function showOutput() {
  /*Did the computer win?:*/
  didComWin();
  /*Is the game a tie?:*/
  tie();
}

/*Resets the game:*/
function reset() {
  location.reload();
}







  
  




