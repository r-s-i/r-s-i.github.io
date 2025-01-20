/*For Styling:*/
/*Checks dimensions:*/
function checkDimensions() {
  const gameBoard = document.getElementById("gameBoard");
  if (window.innerWidth > window.innerHeight) {
    gameBoard.className = "wider";
  } else {
    gameBoard.className = "taller";
  }
}
window.addEventListener("resize", checkDimensions);
checkDimensions();

/*The Game:*/
let SequenceArray = [];
let userSequence = [];
let level = 1
let numberOfClick = 0;
const gameBoard = creatGameBoard();
divAdder()
sequenceMaker(level)

function creatGameBoard() {
  const gameBoard = document.getElementById("gameBoard");
  for (let i = 1; i < 65; i++) {
    let squares = document.createElement('div');
    squares.id = "div_" + i;
    gameBoard.appendChild(squares);
  }
  return gameBoard;
}

// Create position of numbers
function sequenceMaker(p) {
  const gameBoard = document.getElementById("gameBoard");
  const spans = gameBoard.getElementsByTagName("span");
  // Wipes the board clean
  while (spans.length > 0) {
    spans[0].classList.remove("active")
    spans[0].parentNode.removeChild(spans[0]);
  }
  // Adds divs and inner spans with number:
  for (let i = 1; i <= p; i++) {
    let randomNum = Math.ceil(Math.random() * 64);
    while (SequenceArray.includes(randomNum)) {
      randomNum = Math.ceil(Math.random() * 64);
    }
    SequenceArray.push(randomNum);
    let squares = document.getElementById(`div_${randomNum}`)
    let span = document.createElement("span");
    span.classList.add("active");
    span.textContent = i;
    squares.appendChild(span)
  }

  // Disables squaress without numbers:
  for (let i = 1; i < 65; i++) {
    let squares = document.getElementById("div_" + i)
    if (!SequenceArray.includes(i)) {
      squares.classList.add("disabled")
    }
    else {
      squares.classList.remove("disabled")
    }
    // Cleans reveals squaress from last round:
    squares.classList.remove("hidden")
    squares.classList.remove("clickedCorrectly")
  }
}

function divAdder() {
  for (let i = 1; i < 65; i++) {
    let squares = document.getElementById("div_" + i)
    squares.addEventListener("click", function (event) {
      numberOfClick++;

      if (numberOfClick > 0) {
        for (let i = 0; i < SequenceArray.length; i++) {
          document.getElementById("div_" + SequenceArray[i]).classList.add("hidden")
        }
      }
      // Adds:
      if (!userSequence.includes(Number(event.target.textContent))) {
        userSequence.push(Number(event.target.textContent))
      }
      //Checks:
      const isEqual = compareSequences()
      if (!isEqual) {
        end("Game Over <br> Score: ", level)
      }
      if (isEqual && userSequence.length === SequenceArray.length) {
        if (userSequence.length >= 32) {
          end("You Won <br> Score: ", level + 1)
          return;
        }
        wonRound();
      }
    });
  }
}

function compareSequences() {
  if (userSequence[userSequence.length - 1] === userSequence.length) {
    document.getElementById("div_" + SequenceArray[userSequence.length - 1]).classList.add("clickedCorrectly")
    document.getElementById("div_" + SequenceArray[userSequence.length - 1]).classList.add("disabled")
    return true;
  }
  else {
    return false
  }
}

function wonRound() {
  userSequence.length = 0
  SequenceArray.length = 0;
  level++;
  numberOfClick = 0;
  sequenceMaker(level)
}

function end(gameOverMessage, level) {
  gameOverMessage += (level - 1);
  // Deletes all divs:
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  // Shows gameover message:
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "gameOverDiv"
  gameBoard.appendChild(gameOverDiv);
  const p = document.createElement("p");
  p.innerHTML = gameOverMessage;
  gameOverDiv.appendChild(p);
  // Create play again button:
  const button = document.createElement("button");
  button.innerText = "Play again?";
  gameOverDiv.appendChild(button);
  button.addEventListener("click", function () {
    location.reload()
  })
}