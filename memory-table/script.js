const gameBoard = document.getElementById("gameBoard");
const currentStatus = document.getElementById("status");
const scoreDisplay = document.getElementById("score");

let score = 0;
let isGameOver = false;
let won = false;
const paneAmount = gameBoard.getElementsByTagName("td").length
let computerPattern = [];
const PlayerPattern = [];

function patternMaker(s) {
  const pattern = [];
  let i = 0;
  do {
    let randomNumber = Math.ceil(Math.random() * paneAmount);
    while (pattern.includes(randomNumber)) {
      randomNumber = Math.ceil(Math.random() * paneAmount);
    }
    pattern.push(randomNumber)
    i++;
  } while (i <= s)
  return pattern
}

function displayer(s) {
  scoreDisplay.innerHTML = s;
  if (isGameOver) {
    if (won) {
      currentStatus.innerHTML = "You won"
      for (let i = 1; i <= paneAmount; i++) {
        document.getElementById(`${i}`).classList.add("playerActivated")
      };
    } else {
      currentStatus.innerHTML = "You lost"
      for (let i = 1; i <= paneAmount; i++) {
        document.getElementById(`${i}`).classList.add("lost")
      };
    }
    document.getElementById("restart").classList.remove("invisible");
    gameBoard.classList.add("disable");
    return;
  }

  currentStatus.innerHTML = "Computer's turn"
  computerPattern = patternMaker(s)
  gameBoard.classList.add("disable");

  for (let num of computerPattern) {
    document.getElementById(`${num}`).classList.add("computerActivated")
  };

  setTimeout(function () {
    for (let num of computerPattern) {
      document.getElementById(`${num}`).classList.remove("computerActivated")
    }
    gameBoard.classList.remove("disable");
    currentStatus.innerHTML = "Your turn"
  }, 2000);
}

function playerAction(e) {
  if (!PlayerPattern.includes(Number(e.id))) {
    PlayerPattern.push(Number(e.id))
  }
  document.getElementById(`${e.id}`).classList.add("playerActivated")

  if (PlayerPattern.length === computerPattern.length) {
    if (patternChecker(PlayerPattern)) {
      newRound();
    } else {
      isGameOver = true;
      displayer(score);
    }
  }
}

function patternChecker(pattern) {
  let haveTheSameElements = true;

  for (let e of pattern) {
    if (!computerPattern.includes(e)) {
      haveTheSameElements = false
    }
  };
  return haveTheSameElements;
}

function newRound() {
  for (let i = 1; i <= paneAmount; i++) {
    document.getElementById(`${i}`).classList.remove("playerActivated")
  };
  computerPattern.length = 0;
  PlayerPattern.length = 0;
  score++;
  if (score >= paneAmount / 2) {
    isGameOver = true;
    won = true;
    displayer(score)
    gameBoard.classList.add("disable");
  } else {
    displayer(score)
  }
}

displayer(0);