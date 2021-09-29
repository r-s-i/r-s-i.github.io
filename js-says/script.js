/*makes shortcuts for accessing the DOM*/
var result = document.getElementById("result");
var play = document.getElementById("play");
var score = document.getElementById("score");

var panesArray = ["pane-1", "pane-2", "pane-3", "pane-4", "pane-5", "pane-6"];

/*initial setup, gets overwritten*/
var pcGenSequence;
var usedArray = [];
var userGenSequence = [];

function computerRunning() {
  /*hiddes playbutton*/
  play.style.display = "none"; 
  /*removes the score text*/
  score.innerHTML = "";
  /*hiddes the game over message*/
  result.innerHTML = "";
  /*makes pcGenSequence an array, and adds
  the first number*/
  if (!pcGenSequence) {
    pcGenSequence = []
  }
  pcGenSequence.push(Math.ceil(Math.random()*6));

/*translate the computer generate array 
into a text array*/
usedArray = [];
for (let i = 0; i < pcGenSequence.length; i++) {
  usedArray.push(panesArray[pcGenSequence[i] - 1]) 
}

/*goes through each element of usedArray
and graphically shows it to the user*/
for (let i = 0; i < usedArray.length; i++) {

  let timeBefore = i * 1000;
  let timeMiddle = timeBefore + 900;
  let timeAfter = timeMiddle + 100;
  // shows computer-chosen tiles in order
  window.setTimeout(function(){document.getElementById(usedArray[i]).style.backgroundColor = "black";}, timeBefore)
  /* makes it possible to see if there are same numbers after ach other*/
  window.setTimeout(function(){document.getElementById(usedArray[i]).style.backgroundColor = "white";}, timeMiddle)
  window.setTimeout(function(){document.getElementById(usedArray[i]).style.backgroundColor = "";}, timeAfter)
}
} // end of ComputerRunnning

/*adds user selected panes to an array*/
function userClicked(num) {
  userGenSequence.push(num);
} // end of userClicked


function checkSimilarity() {
  if (userGenSequence.join("") == pcGenSequence.join("") && pcGenSequence.join("") != "") {
    userGenSequence = [];
    /*starts the next round*/
    computerRunning();
  }
  else {
    result.innerHTML = "Game Over"
    /*shows final score to user*/
    score.innerHTML = "Score: " + String(pcGenSequence.length - 1);
    /*resets user and computer selected 
    array*/
    userGenSequence = [];
    pcGenSequence = [];
    /*makes the play button visible again*/
    play.style.display = "inline-block";
  }
} // end of checkSimilarity











