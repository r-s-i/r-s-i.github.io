const firstQuestionRow = document.getElementById("firstQuestionRow")
const secondQuestionRow = document.getElementById("secondQuestionRow")
const thirdQuestionRow = document.getElementById("thirdQuestionRow")
const answersRow = document.getElementById("answersRow")

let points = 0;
let lives = 3;
let panesArray = ["", "", ""]
let elapsedTime = 0;
let answersArePlaced = false;
let answer = 0;
let answers = [];
let problem = "";
let timeCreated = Date.now();
let intervalID = 0;
let isGameOver = false;

function makeProblem() {
  let [int1, int2, int3] = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9) + 1);

  if (points < 3) {
    problem = `${int1} + ${int2}`;
    answer = int1 + int2;
  }
  else if (points < 6) {
    problem = `${int1} + ${int2} + ${int3}`;
    answer = int1 + int2 + int3;
  }
  else if (points < 9) {
    problem = `${int1} × ${int2}`;
    answer = int1 * int2;
  }
  else if (points < 12) {
    [int1, int2, int3] = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1);
    problem = `${int1} × ${int2} × ${int3}`;
    answer = int1 * int2 * int3;
  }
  else if (points < 15) {
    const isMultiSignFirst = 0.5 <= Math.random();
    if (isMultiSignFirst) {
      problem = `${int1} × ${int2} + ${int3}`;
      answer = int1 * int2 + int3;
    }
    else {
      problem = `${int1} + ${int2} × ${int3}`;
      answer = int1 + int2 * int3;
    }
  }
  else if (points < 18) {
    problem = `${int1} - ${int2}`;
    answer = int1 - int2;
  }
  else if (points < 21) {
    problem = `${int1} - ${int2} - ${int3}`;
    answer = int1 - int2 - int3;
  }
  else if (points < 24) {
    problem = `${int1} / ${int2}`;
    answer = (int1 / int2).toFixed(3);
  }
  else if (points < 27) {
    problem = `${int1} / ${int2} / ${int3}`;
    answer = (int1 / int2 / int3).toFixed(3);
  }
  else if (points < 30) {
    const isDiviSignFirst = 0.5 <= Math.random();
    if (isDiviSignFirst) {
      problem = `${int1} / ${int2} - ${int3}`;
      answer = (int1 / int2 - int3).toFixed(3);
    }
    else {
      problem = `${int1} - ${int2} / ${int3}`;
      answer = (int1 - int2 / int3).toFixed(3);
    }
  }
  else if (points < 33) {
    problem = `${int1}^2`;
    answer = int1 * int1;
  }
  else if (points < 36) {
    problem = `${int1}^3`;
    answer = int1 * int1 * int1;
  }
  console.log(answer);
  return answer;
}

function clearQuestionRows() {
  firstQuestionRow.textContent = "";
  secondQuestionRow.textContent = "";
  thirdQuestionRow.textContent = "";
  secondQuestionRow.classList.remove("lightRed");
  thirdQuestionRow.classList.remove("red");
}

function placeProblem(row) {
  if (row === 0) {
    firstQuestionRow.textContent = problem;
  }
  else if (row === 1) {
    secondQuestionRow.textContent = problem;
    secondQuestionRow.classList.add("lightRed");
  }
  else if (row === 2) {
    thirdQuestionRow.textContent = problem;
    thirdQuestionRow.classList.add("red");
    panesArray[2] = problem;
  }
}

function placeAnswers(answer) {
  answer = parseFloat(answer)
  answers = [answer];
  while (answers.length < 4) {
    let answerToPush = parseFloat((answer - 10 + Math.ceil(Math.random() * 19)).toFixed(3));

    if (!answers.includes(answerToPush)) answers.push(answerToPush)
  }
  let indexes = [0, 1, 2, 3]
  indexes.sort(() => 0.5 - Math.random());
  for (let i = 0; i < 4; i++) {
    answersRow.children[i].textContent = answers[indexes[i]]
  }
}

function reset() {
  panesArray = ["", "", ""];
  elapsedTime = 0;
  answersArePlaced = false;
  clearQuestionRows()
  timeCreated = Date.now();
}

function update() {
  document.getElementById("pointsOutput").textContent = "Points: " + points
  document.getElementById("livesOutput").textContent = "❤️ " + lives

  if (isGameOver) {
    return;
  }
  if (lives < 1) {
    message(false);
    return;
  }
  if (points === 36) {
    message(true);
    return;
  }
  if (!answersArePlaced) {
    placeAnswers(makeProblem());
    answersArePlaced = true;
    intervalID = setInterval(update, 100);
  }
  clearQuestionRows()
  if (elapsedTime < 3000) {
    placeProblem(0);
  }
  else if (elapsedTime < 6000) {
    placeProblem(1);
  }
  else if (elapsedTime < 9000) {
    placeProblem(2);
  }
  else if (elapsedTime < 10000) {
    answersRow.classList.add("fadeOut");
    setTimeout(() => {
      answersRow.classList.remove("fadeOut");
    }, 2000)
  }
  else {
    clearInterval(intervalID);
    lives--;
    reset();
    update();
  }
  elapsedTime = Date.now() - timeCreated;
}

function message(hasWon) {
  isGameOver = true;
  if (hasWon) {
    panesArray = [
      "You Won! Tap on",
      "RESET", "to play again"
    ];
  }
  else {
    panesArray = [
      "You lost! Tap on",
      "RESET", "to play again"
    ];
  }
  firstQuestionRow.textContent = panesArray[0]
  secondQuestionRow.textContent = panesArray[1]
  thirdQuestionRow.textContent = panesArray[2]
  secondQuestionRow.addEventListener("click", () => {
    location.reload();
  })

}

update()

answersRow.addEventListener("click", (e) => {
  if (isGameOver) return;
  if (Number(e.target.textContent) === Number(answer)) {
    points++;
  }
  else {
    points--;
    lives--;
  }
  reset();
})