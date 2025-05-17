// The Game:
// Global variables:
let loopId;
let snek;
let table;
let egg;
let keyPressed = "";
let previousKeyPressed = "";
let updateCount = 0
let score = 0;
let canvas; // html element
let isGameOver = false;
let gamePadLoop;
const allowedInputs = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"]


// EventListeners:
// For Keyboard:
window.addEventListener('keydown', (event) => {
  if (allowedInputs.includes(event.key.toLowerCase())) {
    event.preventDefault();
    keyPressed = event.key;
    switch (keyPressed.toLocaleLowerCase()) {
      case "w":
        keyPressed = "ArrowUp"
        break;
      case "a":
        keyPressed = "ArrowLeft"
        break;
      case "s":
        keyPressed = "ArrowDown"
        break;
      case "d":
        keyPressed = "ArrowRight"
        break;
    }
  }
  else {
    keyPressed = ""
  }
  // Restarts game:
  if (event.key === "Enter" && isGameOver) {
    location.reload();
  }
});

// For buttons
document.querySelectorAll('.triangles').forEach(e => {
  e.addEventListener('click', (e) => {
    keyPressed = e.target.classList[1];
  });
});
Enter.addEventListener('click', (event) => {
  // Restarts game:
  if (isGameOver) {
    location.reload();
  }
});

// Table related:
function tableMaker(width, height) {
  canvas = document.getElementById("gameBoard");
  const table = document.createElement("table");
  canvas.appendChild(table);
  for (let y = 0; y < height; y++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let x = 0; x < width; x++) {
      const td = document.createElement("td");
      td.id = x + "_" + y
      tr.appendChild(td);
    }
  }
  return { width: width, height: height, tableSize: height * width }
}


// Snek related:
function createSnek() {
  let settings = document.getElementById("settings");
  settings = JSON.parse(settings.innerHTML);
  const snek = {
    body: [
      { x: table.width / 2, y: table.height / 2 - 1 },
      { x: table.width / 2 - 1, y: table.height / 2 - 1 },
      { x: table.width / 2 - 2, y: table.height / 2 - 1 },
    ],
    speed: settings.speed,
    direction: 4,
    canMove: true,
    countSinceMoved: 0,
  }
  return snek
}

function showSnek() {
  // Remove the previous snek picture:
  for (let x = 0; x < table.width; x++) {
    for (let y = 0; y < table.height; y++) {
      let square = document.getElementById(`${x}_${y}`);
      square.classList.remove("snekBody")
      square.classList.remove("snekHead")
    }
  }

  // Repaints the Snek:
  for (let i = 0; i < snek.body.length; i++) {
    let square = document.getElementById(`${snek.body[0].x}_${snek.body[0].y}`);
    square.classList.add("snekHead")

    for (let x = 0; x < table.width; x++) {
      for (let y = 0; y < table.height; y++) {
        if (snek.body[i].x === x && snek.body[i].y === y) {
          square = document.getElementById(`${snek.body[i].x}_${snek.body[i].y}`);
          square.classList.add("snekBody")
        }
      }
    }
  }
}

function growSnek() {
  snek.body.push({ x: snek.body[snek.body.length - 1].x, y: snek.body[snek.body.length - 1].y })
}

function moveSnek(direction) {
  switch (direction) {
    case "ArrowUp":
      snek.body.unshift({ x: snek.body[0].x, y: snek.body[0].y - 1 })
      snek.body.pop();
      snek.direction = 1;
      break;
    case "ArrowDown":
      snek.body.unshift({ x: snek.body[0].x, y: snek.body[0].y + 1 })
      snek.body.pop();
      snek.direction = 2;
      break;
    case "ArrowLeft":
      snek.body.unshift({ x: snek.body[0].x - 1, y: snek.body[0].y })
      snek.body.pop();
      snek.direction = 3;
      break;
    case "ArrowRight":
      snek.body.unshift({ x: snek.body[0].x + 1, y: snek.body[0].y })
      snek.body.pop();
      snek.direction = 4;
      break;
  }

}

function SnekEatingSnek() {
  for (let i = 1; i < snek.body.length; i++) {
    if (snek.body[0].x === snek.body[i].x && snek.body[0].y === snek.body[i].y) {
      return true;
    }
  }
  return false;
}

function snekHitWall() {
  if (snek.body[0].x >= table.width || snek.body[0].x < 0) {
    return true;
  }
  if (snek.body[0].y >= table.height || snek.body[0].y < 0) {
    return true;
  }
  return false
}

function gameOver(won = false) {
  clearInterval(loopId)
  isGameOver = true;
  canvas.removeChild(canvas.firstChild);
  canvas.removeChild(canvas.firstChild);
  document.querySelectorAll('.triangles').forEach(e => {
    e.remove();
});

  const p = document.createElement("p")
  const alwaysInMessage = "<br> Press Enter (or A on the Xbox controller) to start again";
  document.getElementById("Enter").style.display = "block";
  if (!won) {
    p.innerHTML = "Game over. Score: " + score + alwaysInMessage;
  }
  else {
    p.innerHTML = "You won, snek very fed. Score: " + score + alwaysInMessage;
  }
  canvas.appendChild(p)
}

// Egg related
function createEgg() {
  let x = Math.floor(Math.random() * table.width);
  let y = Math.floor(Math.random() * table.height);
  // Checks if egg would be created on snek body:
  for (let i = 0; i < snek.body.length; i++) {
    while (x === snek.body[i].x && y === snek.body[i].y) {
      x = Math.floor(Math.random() * table.width);
      y = Math.floor(Math.random() * table.height);
      i = 0;
    }
  }
  const egg = {
    coordinates: { x: x, y: y }
  }
  return egg;
}

function showEgg() {
  const eggLocation = document.getElementById(`${egg.coordinates.x}_${egg.coordinates.y}`)
  eggLocation.classList.add("egg")
}

function destroyEgg() {
  const eggLocation = document.getElementById(`${egg.coordinates.x}_${egg.coordinates.y}`)
  eggLocation.classList.remove("egg")
}

function isNewEggNeeded() {
  if (egg.coordinates.x === snek.body[0].x && egg.coordinates.y === snek.body[0].y) {
    return true;
  }
  return false;
}

// frank-n-functions:
function moveOrAutoMoveSnek() {
  // Checks if player is allowed to make a new move:
  if (keyPressed !== "" && keyPressed !== previousKeyPressed && (updateCount % snek.speed === 0)) {
    snek.canMove = true;
  }

  // Prevents the snek from going in the opposite Direction:
  if (snek.direction === 1 && keyPressed === "ArrowDown") {
    snek.canMove = false;
  }
  if (snek.direction === 2 && keyPressed === "ArrowUp") {
    snek.canMove = false;
  }
  if (snek.direction === 3 && keyPressed === "ArrowRight") {
    snek.canMove = false;
  }
  if (snek.direction === 4 && keyPressed === "ArrowLeft") {
    snek.canMove = false;
  }

  // Moves snek according to player's direction:
  if (snek.canMove) {
    moveSnek(keyPressed)
    updateCount = 1
    previousKeyPressed = keyPressed
    snek.canMove = false;
  }

  // Automoves snek:
  if (!snek.canMove && (updateCount % snek.speed === 0)) {
    moveSnek(previousKeyPressed)
    keyPressed = ""
  }
}

function checksForGameOver() {
  // Checks if game is over:
  if (SnekEatingSnek()) {
    gameOver();
  }
  if (snekHitWall()) {
    gameOver();
  }
  // If game is won:
  if (table.tableSize < snek.body.length + 1) {
    gameOver(true);
  }
}

function destroyCreateAndShowEgg() {
  destroyEgg()
  egg = createEgg()
  showEgg();
}

function createNewEggIfNeeded() {
  if (isNewEggNeeded()) {
    destroyCreateAndShowEgg()
    growSnek()
    score++
  }
}

(function onStart() {
  table = tableMaker(32, 32);
  snek = createSnek()
  egg = createEgg()
  showEgg();
  moveOrAutoMoveSnek();
  showSnek();
})();

function loop() {
  checksForGameOver()
  if (isGameOver) {
    return;
  }
  gamePadLoop = makeGamePadLoop
  createNewEggIfNeeded()
  moveOrAutoMoveSnek()
  showSnek(snek.body);
  updateCount++ // Used in moveOrAutoMoveSnek
}
loopId = setInterval(loop, 1);

// For controller:
window.addEventListener("gamepadconnected", function (event) {
  loop() // Called once, so gamePadLoop is always defined
  requestAnimationFrame(gamePadLoop);
});

function makeGamePadLoop() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i];
    if (gamepad) {
      // Check for button pressed:
      for (let j = 0; j < gamepad.buttons.length; j++) {
        if (gamepad.buttons[j].pressed) {
          switch (j) {
            case 12:
              keyPressed = "ArrowUp"
              break;
            case 13:
              keyPressed = "ArrowDown"
              break;
            case 14:
              keyPressed = "ArrowLeft"
              break;
            case 15:
              keyPressed = "ArrowRight"
              break;
            case 0:
              if (isGameOver) {
                location.reload();
              }
              break;
            default:
              keyPressed = "none"
          }
          break;
        }
      }
      // Check for Axis pressed:
      for (let j = 0; j < gamepad.axes.length; j++) {
        if (Math.abs(gamepad.axes[j]) > 0.5) {
          let input = j + "_" + Math.round(gamepad.axes[j]);
          switch (input) {
            case "1_-1":
              keyPressed = "ArrowUp"
              break;
            case "1_1":
              keyPressed = "ArrowDown"
              break;
            case "0_-1":
              keyPressed = "ArrowLeft"
              break;
            case "0_1":
              keyPressed = "ArrowRight"
              break;
          }
          break;
        }
      }
    }
  }
  if (gamePadLoop) {
    requestAnimationFrame(gamePadLoop);
  }
}