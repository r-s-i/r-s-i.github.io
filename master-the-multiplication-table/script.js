let score = 0;
const message = document.getElementById("message")
const inputField = document.getElementById("userInput");
const btn = document.getElementById("btn");

let product;
function setup() {
  let n1 = Math.ceil(Math.random() * 12);
  let n2 = Math.ceil(Math.random() * 12);
  product = n1 * n2;

  document.getElementById("problem").textContent = `${n1} × ${n2} =`;
  document.getElementById("sr_problem").textContent = `${n1} × ${n2} =`;

  inputField.value = "";
  inputField.focus();
}
setup();

// Checks answer. Updates score depending on answer
function checkAnswer() {
  let userInput = document.getElementById("userInput").value;
  if (product === Number(userInput)) {
    score++;
    message.innerHTML = "Correct, score: " + score;
  } else {
    score--;
    message.innerHTML = "Wrong, score: " + score;
  }
  setup();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
})
btn.addEventListener("click", () => {
  checkAnswer();
})