const alphabetArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", 
                    "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

/*Possible responses if the user picks a wrong letter:*/
const wrongLetterLines = ["Nope.", "Sorry, my word doesn't have that letter.", 
                        "No, try again.", "Wrong.", "Some of these words are really hard.", 
                        "Try one of these: e, t, a, o, i, n, s, h, r, d, l, or u", 
                        "Maybe try using x, y, or z. What's the harm?"];

function getWrongLetterLines() {
  let randomNum = Math.floor(Math.random()*wrongLetterLines.length);
  return wrongLetterLines[randomNum];
}

function pickRandomWord() {
  let pickedNum = Math.floor(Math.random()*words.length);
  return words[pickedNum];
} let pickedWord = pickRandomWord();

function makeArrOutOfWord() {
  return pickedWord.split("");
} let wordAsArr = makeArrOutOfWord();

function showWordLengthGraphically() {
  for (let i = 0; i < wordAsArr.length; i++) {
    if (true) {
      document.getElementById("letter_"+i).innerHTML = "_ "
    }  
  }
} showWordLengthGraphically();

/*guess():*/
/*For DOM manipulation:*/
let message = document.getElementById("message");
let display = document.getElementById("display");
let resetButton = document.getElementById("reset_button");
let guessButton = document.getElementById("guess_button");
/*Boolean:*/
let isGameOver = false;
/*Counters:*/
let correctLettersCounter = 0;
let picCounter = 1;
/*Arrays:*/
let wrongLetters = [];
let guessedLetters = [];
function guess() {
  if (isGameOver) {
    return;
  }

  /*Assignes input field to userInput:*/
  let inputField = document.getElementById("user_guessed_letter");
  /*Assignes what user entered to userInput:*/
  let userInput = inputField.value;
  userInput = userInput.toLowerCase();
  

  /*If the user already has guessed that letter, inform the user and exit function:*/
  if (guessedLetters.includes(userInput)) {
    message.innerHTML = "You've already tried that letter.";
    inputField.value = "";
    return;
  }

  /*If user input is not one letter from the English alphabet return with a message:*/
  let allowedsymbol = false;
  for(let i = 0; i < alphabetArr.length; i++) {
    if (userInput == alphabetArr[i] && userInput.length == 1) {
      allowedsymbol = true;
    }
  }
  if (!allowedsymbol) {
    message.innerHTML = "Please select one letter of the alphabet."
    inputField.value = "";
    return;
  }

  /*If user guessed a correct letter, replace "_" with the letter, and return:*/
  for (let i = 0; i < wordAsArr.length; i++) {
    if (userInput == wordAsArr[i] && allowedsymbol) {
      guessedLetters.push(userInput);
      document.getElementById("letter_"+i).innerHTML = wordAsArr[i];
      correctLettersCounter++
      inputField.value = "";
    }  
  }
  
  /*If user guessed incorrectly, draw one more detail:*/
  if (wordAsArr.includes(userInput) === false && picCounter < 10) {
    picCounter++;
    display.style.backgroundImage = `url('img/${picCounter}.png')`
    message.innerHTML = getWrongLetterLines();
    wrongLetters.push(userInput);
    document.getElementById("letters_guessed").innerHTML += `${userInput} `;
    guessedLetters.push(userInput);
  }

  /*If the man is hanged, the game is over:*/
  if (picCounter >= 10) {
    message.innerHTML = "Game Over."
    display.style.backgroundImage = "url('img/10.png')";
    /*Makes the reset button appears, and the guess button disappears:*/
    resetButton.style.display = "block";
    guessButton.style.display = "none"
    setTimeout(function(){message.innerHTML = `The answer was "${pickedWord}"`;}, 2000);
    /*For resetting:*/
    isGameOver = true;
  }

  /*If the user won, show it:*/
  if (correctLettersCounter == wordAsArr.length) {
    /*Displays "win screen" (picture):*/
    display.style.backgroundImage = "url('img/11.png')";
    /*Congratulates the user (text):*/
    message.innerHTML = "Congratulation!";
    /*Makes the reset button appears, and the guess button disappears:*/
    resetButton.style.display = "block";
    guessButton.style.display = "none";
    /*For resetting:*/
    isGameOver = true;
  }
  /*Clears the input field for the next round:*/
  inputField.value = "";
}

/*Checks if the enter key (return) is used*/
function isReturnDown() {
  if (event.code == "Enter" || event.keyCode == 13) {
    if (isGameOver) {
      reset();
    }
    guess();
  }
}

/*Resets the game by reloading the page:*/
function reset() {
  location.reload();
}

/*End*/