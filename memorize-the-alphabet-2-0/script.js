/*Turns "document.querySelector('ref')" to "$('ref')":*/
function $(ref) {
  return document.querySelector(ref);
}

let game = {
  alphabet: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  counter: 0,
  gameWon() {
    $("#info").innerHTML = "Congratulations! You won!";
    setTimeout(function() {
      location.reload();
    }, 1500)
  },

  /*Performs functions that are in common across versions:*/
  common(specialInfo, alphabet, counter, gameWon) {
    $("#info").innerHTML = `Type out the ${specialInfo}`;
    /*Creating input field for user to type in:*/
    let inputField = $("textarea");
    inputField.value = "";
    let writtenArr = "";
    writtenArr = []; // To keep track of what is written.
    let main = $("main")

    main.addEventListener("keyup", function() {
      if (inputField.value[counter] == alphabet[counter]) {
        writtenArr.push(alphabet[counter])

        counter++
      } else {
        inputField.value = writtenArr.join(""); // If wrong character, delete that character
        console.log("counter, else:" + counter);
      }

      // If won show the end screen, 26th letter (z or a) written.
      if (counter == 26) {
        gameWon();
      }
    });
  },

  normal() {
    let common = this.common;
    common("alphabet", this.alphabet, this.counter, this.gameWon)
  }, // End of normal();

  backwards() {
    let common = this.common;
    common("reverse alphabet", this.alphabet.reverse(), this.counter, this.gameWon)
  }
} // End of game;


$("#backwards").addEventListener("click", function() {
  $("#backwards").style.display = "none";
  $("#normal").style.display = "inline-block";
  game.backwards();
});
$("#normal").addEventListener("click", function() {
  location.reload();
});

/*When first loaded, set to normal game:*/
game.normal();
