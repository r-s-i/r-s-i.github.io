const tdSequence = []
let tdSequenceLocation = 0;
const playerSequence = [];
let playerSequenceLocation = 0;

function sequenceAdder() {
    let ranNumber = Math.ceil(Math.random() * document.querySelectorAll("td").length)
    if (ranNumber == tdSequence[tdSequence.length - 1]) {
        ranNumber = sequenceAdder();
    }
    return ranNumber;
}
function sequenceDisplayer() {
    if (tdSequenceLocation >= tdSequence.length) {
        document.getElementById("message").innerHTML = "Your turn"
        document.getElementById("game_board").classList.remove("disable");
        return;
    }
    const e = document.getElementById(`${tdSequence[tdSequenceLocation]}`);
    e.classList.add("tdDarkBlueBg");
    setTimeout(function () {
        e.classList.remove("tdDarkBlueBg");
        tdSequenceLocation++;
        sequenceDisplayer();
    }, 1000);
}

function playerSequenceAdder(e) {
    playerSequence.push(Number(e.id));

    if (tdSequence[playerSequenceLocation] != playerSequence[playerSequenceLocation]) {
        gameOver();
        tdSequence.length = 0;
    }

    playerSequenceLocation++
    if (playerSequenceLocation == tdSequence.length) {
        game();
    }
}

function game() {
    document.getElementById("score").innerHTML = tdSequenceLocation
    document.getElementById("message").innerHTML = "Computer's turn"
    document.getElementById("game_board").classList.add("disable");
    tdSequence.push(sequenceAdder());
    playerSequenceLocation = 0;
    tdSequenceLocation = 0;
    playerSequence.length = 0;
    sequenceDisplayer()
}
function gameOver() {
    document.getElementById("message").innerHTML = "GAME OVER!"
    document.getElementById("game_board").classList.add("disable");
    document.getElementById("restart").style.visibility = "visible";
}
game();