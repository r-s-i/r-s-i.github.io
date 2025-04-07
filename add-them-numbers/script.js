const game = document.getElementById("game");
const playAgainButton = document.querySelector("button");
const input = document.getElementById("input");
const output = document.getElementById("output");
const screenReaderOutput = document.getElementById("sr_output");
const score = document.getElementById("score");
const settings = document.getElementById("settings");
const settingsOpener = document.getElementById("settings_opener");
const close = document.getElementById("close");
const apply = document.getElementById("apply");
let userInput = "";
let answer;
let isGameOver = false;
let gameSpeedInMs = document.getElementById("reaction_time").value;
let sequenceLength = document.getElementById("sequence_length").value;
let digitLength = document.getElementById("digit_length").value;
let maxDigitLength = document.getElementById("max_digit_length").value;
let maxSequenceLength = document.getElementById("max_sequence_length").value;

function loop() {
  if (isGameOver) return;
  const sequence = makeSequence();
  score.textContent = `${sequenceLength} - ${digitLength}`;
  showSequence(sequence);
  answer = calculateAnswer(sequence);
  readyForPlayerInput(sequence);
} loop();

window.addEventListener("keyup", (e) => {
  if (e.target.tagName === "INPUT") {
    userInput = e.target.value;
    checkInput(userInput);
  }
  if (e.key === "Enter" && isGameOver) restart();
});

function checkInput(userInput) {
  if (userInput.length < answer.length) return;
  if (userInput !== answer) {
    lost();
  }
  else {
    sequenceLength++;
    if (sequenceLength > maxSequenceLength) {
      sequenceLength = document.getElementById("sequence_length").value;
      digitLength++;
    }
    if (digitLength > maxDigitLength) {
      won();
    }
    loop();
  }
}

function won() {
  if (isGameOver) return;
  isGameOver = true;
  output.textContent = "Congratulations! \nYou added those numbers.";
  screenReaderOutput.textContent = "Congratulations! You added those numbers.";
  input.classList.remove("visible");
  playAgainButton.classList.add("visible");
}

function lost() {
  if (isGameOver) return;
  isGameOver = true;
  output.textContent = "Game Over";
  screenReaderOutput.textContent = "Game Over";
  input.classList.remove("visible");
  playAgainButton.classList.add("visible");
}

playAgainButton.addEventListener("click", () => restart());

function restart() {
  gameSpeedInMs = document.getElementById("reaction_time").value;
  sequenceLength = document.getElementById("sequence_length").value;
  digitLength = document.getElementById("digit_length").value;
  maxSequenceLength = document.getElementById("max_sequence_length").value;
  maxDigitLength = document.getElementById("max_digit_length").value;
  output.textContent = "";
  playAgainButton.classList.remove("visible");
  input.classList.remove("visible");
  isGameOver = false;
  loop();
}

function makeSequence() {
  let sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    let randomInt = Math.ceil(Math.random() * ((10 ** digitLength) - 1));
    // Avoids repeating the same number back-to-back, or lower than given digitlength
    while (randomInt === sequence[i - 1] || randomInt < 10 ** (digitLength - 1)) {
      randomInt = Math.ceil(Math.random() * ((10 ** digitLength) - 1));
    }
    sequence.push(randomInt);
  }
  return sequence;
}

function showSequence(sequence) {
  input.classList.remove("visible");
  output.classList.add("visible");
  screenReaderOutput.textContent = sequence.join("+");
  for (let i = 0; i < sequence.length; i++) {
    setTimeout(() => {
      output.textContent = sequence[i];
    }, gameSpeedInMs * i);
    setTimeout(() => {
      output.textContent = "";
    }, gameSpeedInMs * sequence.length);
  }
}

function calculateAnswer(sequence) {
  answer = sequence.reduce((sum, el) => {
    return sum += el;
  }, 0)
  return answer.toString();
}

function readyForPlayerInput(sequence) {
  setTimeout(() => {
    input.value = "";
    input.classList.add("visible");
    input.focus();
  }, gameSpeedInMs * sequence.length);
}

// Dialog releated
close.addEventListener("click", () => {
  settings.close();
});

settingsOpener.addEventListener("click", (e) => {
  e.preventDefault();
  settings.showModal();
  settings.focus()
})

apply.addEventListener("click", (e) => {
  e.preventDefault();
  settings.close();
  restart();
});
