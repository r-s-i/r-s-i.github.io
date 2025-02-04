const canvas = document.getElementById("canvas");
let intLength = 3;
let randomInt;
let userInput = "";
let lives = 3;

function gameLoop(intLength) {
  /*Show a given amout of numbers for 2 sec, start with 3 digits*/
  function makeRandomStringOfNums(intLength) {
    const randomNumArray = [];
    for (let i = 0; i < intLength; i++) {
      let randomDigit = (Math.floor(Math.random() * 10))
      while (i === 0 && randomDigit === 0) {
        randomDigit = (Math.floor(Math.random() * 10)) // Makes sure not to start with 0
      }
      randomNumArray.push(randomDigit)
    }
    return randomNumArray.toString().replaceAll(",", "");
  }
  randomInt = makeRandomStringOfNums(intLength)
  // Show numbers to player:
  function showNumsToPlayer() {
    canvas.innerHTML = `<p>${randomInt}</p>`;
    setTimeout(() => {
      // Replace numbers p with a input field
      canvas.innerHTML = "<input id='user_input'>"
      const input = document.getElementById("user_input");
      input.setAttribute("autocomplete", "off");
      input.focus()
    }, 2000)
  }
  showNumsToPlayer()
}
gameLoop(intLength);

/*Check input*/
// When userinput is as long as number string, check if identical
document.addEventListener("keyup", (e) => {
  try {
    userInput = document.getElementById("user_input").value;
  }
  catch (e) {
    return
  }
  if (userInput.length >= randomInt.length) {
    // If correct give new number, add one digit
    if (userInput === randomInt) {
      canvas.classList.add("correct")
      setTimeout(function () {
        canvas.classList.remove("correct")
      }, 1000)
      intLength++
      userInput = ""
    }
    else {
      // If wrong try again, with new number
      userInput = ""
      lives--;
      canvas.classList.add("wrong")
      setTimeout(function () {
        canvas.classList.remove("wrong")
      }, 2000)
    }
    // If player guessed 25 digits, he won
    if (intLength > 25) {
      gameOver(false);
      return
    }
    // Continue playing until lives run out
    if (lives > 0) {
      gameLoop(intLength)
    }
    else {
      gameOver()
    }
  }
})

// Autofocus when clicking the canvas:
canvas.addEventListener("click", () => {
  try {
    document.getElementById("user_input").focus();
  }
  catch (e) {
    return
  }
})

function gameOver(lost = true) {
  let endGameText = "";
  if (lost) {
    endGameText = `Game over <br> Press Enter (or hit restart) to play again`
  }
  else {
    endGameText = `You won! <br> Press Enter (or hit restart) to play again`
  }
  if (intLength > 3) {
    endGameText += `<br> You could remember up to  ${intLength - 1} digits`
  }
  canvas.innerHTML = `<p>${endGameText}</p>`;

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      lives = 3;
      intLength = 3;
      gameLoop(intLength)
    }
  })
}