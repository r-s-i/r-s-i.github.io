const result = document.getElementById("result");
const game = document.getElementById("game");
const play = document.getElementById("play");
const check = document.getElementById("check")
const score = document.getElementById("score");
const pcGenSequence = [];
const userGenSequence = [];

function computerRunning() {
  // Hides input & output
  play.style.display = "none";
  score.textContent = "";
  result.textContent = "";
  // Adds the first number
  pcGenSequence.push(Math.ceil(Math.random() * 5));
  // Shows pcGenSequence to the user
  for (let i = 0; i < pcGenSequence.length; i++) {
    const timeBefore = i * 1000;
    const timeMiddle = timeBefore + 900;
    const timeAfter = timeMiddle + 100;
    const currentPane = document.getElementById(`pane-${pcGenSequence[i]}`)
    window.setTimeout(function () { currentPane.style.backgroundColor = "black"; }, timeBefore)
    /* makes it possible to see if there are same numbers after ach other*/
    window.setTimeout(function () { currentPane.style.backgroundColor = "white"; }, timeMiddle)
    window.setTimeout(function () { currentPane.style.backgroundColor = ""; }, timeAfter)
  }
}

// Adds user selected panes to an array
game.addEventListener("click", (e) => {
  if (/[0-5]/.test(e.target.id)) {
    userGenSequence.push(e.target.id.split("-")[1]);
  }
})
check.addEventListener("click", checkIfEqual);
play.addEventListener("click", computerRunning);

function checkIfEqual() {
  if (userGenSequence.join("") == pcGenSequence.join("") && pcGenSequence.join("") != "") {
    // Starts the next round
    userGenSequence.length = 0;
    computerRunning();
  }
  else {
    // Game over
    result.textContent = "Game Over"
    score.textContent = "Score: " + String(pcGenSequence.length - 1);
    // Resets
    userGenSequence.length = 0;
    pcGenSequence.length = 0;
    play.style.display = "inline-block";
  }
}











