const maxBeats = 24;
let bpm = 100;
let durNumsArr = [333, 333, 333];
let interval = 60 / bpm;
let nextNoteTime = 0;
let isRunning = false;
let timerId = null;
let count = 0;
let durNumsTotal = durNumsArr.reduce((t, c) => t + c);
let audioCtx;
let durationOfSound = 0.05;
let activeOscillators = new Set();

// To prevent "going to sleep" when running
let wakeLock = null;
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } 
  catch {}
};

// To keep wake lock active on visibility change
document.addEventListener("visibilitychange", async () => {
  if (wakeLock !== null && document.visibilityState === "visible" && isRunning) {
    await requestWakeLock();
  }
});

function soundMaker(frequency, volume, durationOfSound, startTime, count) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  activeOscillators.add(osc);
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationOfSound);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + durationOfSound);
  
  osc.onended = () => {
    activeOscillators.delete(osc);
    osc.disconnect();
    gain.disconnect();
    if (isRunning) {
      showActiveBeatVisually(count)
    };
  };
}

function scheduler() {
  durNumsTotal = durNumsArr.reduce((t, c) => t + c);
  while (nextNoteTime < audioCtx.currentTime + 1) { // scheduling 1 sec ahead
    if (durNumsArr.length === 1) {
      soundMaker(660, 1, durationOfSound, nextNoteTime, count);
    } else {
      if (count === 0) {
        soundMaker(660, 1, durationOfSound, nextNoteTime, count);
      } else {
        soundMaker(440, 0.9, durationOfSound, nextNoteTime, count);
      }
    }
    const measureDuration = interval * durNumsArr.length;
    const ratio = durNumsArr[count] / durNumsTotal;
    nextNoteTime += measureDuration * ratio;
    count = (count + 1) % durNumsArr.length;
  }
}

async function startMetronome() {
  if (!audioCtx)  {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } 

  await audioCtx.resume();
  
  if (!wakeLock) {
    await requestWakeLock();
  }
  
  count = 0;
  nextNoteTime = audioCtx.currentTime + 0.05;
  isRunning = true;
  timerId = setInterval(scheduler, 20);
  playBtn.textContent = "Stop";
}

async function stopMetronome() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
  
  clearInterval(timerId);
  timerId = null;
  isRunning = false;

  activeOscillators.forEach(osc => {
    try {
      if (audioCtx.state !== "closed") {
        osc.stop();
      }
    } catch {}
  });
  audioCtx.suspend();
  activeOscillators.clear();

  hideBeatVisually();
  playBtn.textContent = "Play";
}

// The UI
// Controls section
const playBtn = document.querySelector("#playBtn");
playBtn.addEventListener("click", async () => {
  isRunning ? await stopMetronome() : await startMetronome();
});

// Number of beats section
const addBeatBtn = document.querySelector("#addBeatBtn");
const removeBeatBtn = document.querySelector("#removeBeatBtn");
addBeatBtn.addEventListener("click", () => {
  removeBeatBtn.disabled = false;
  if (isRunning) {
    restartMetronome()
  };
  addToDurNumsArr();
  addVisualBeatToDOM();
  updateNumOfBeatsDisplay();
  addDurationContainer(durNumsArr.length);
  addEventToDurationContainers();
  updatePercentageLabels();
  updateCycleVisualizer();
  if (durNumsArr.length >= maxBeats) {
    addBeatBtn.disabled = true;
  }
});

removeBeatBtn.addEventListener("click", () => {
  addBeatBtn.disabled = false;
  if (durNumsArr.length <= 1) return;
  if (isRunning) {
    restartMetronome()
  };
  removeFromDurNumsArr();
  removeVisualBeatFromDOM();
  updateNumOfBeatsDisplay();
  removeDurationContainer();
  updatePercentageLabels();
  updateCycleVisualizer();
  if (durNumsArr.length === 1) removeBeatBtn.disabled = true;
});

// Cycle visualizer section
function updateCycleVisualizer() {
  const cycleVisualizer = document.querySelector("#cycleVisualizer");

  while (cycleVisualizer.firstChild) {
    cycleVisualizer.removeChild(cycleVisualizer.firstChild);
  }

durNumsArr.forEach((value, i) => {
  const segment = document.createElement("span");
  segment.style.width = (value / durNumsTotal) * 100 + "%";
  segment.className = "segment";
  if (i > 0) segment.style.borderLeft = `dimgrey 2px solid`;
  cycleVisualizer.appendChild(segment);
});
}
updateCycleVisualizer();

// Manual Tempo section
const manualBtn = document.querySelector("#manualBtn");
let manualBeatsDuration = [];
let startTime = null;
let lastTime = null;
let clicks = 0;
manualBtn.addEventListener("click", async () => {
  if (!audioCtx)  {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } 
  clicks++;
  let manualCount = clicks -1
  // Audible indication
  if (clicks === 1) {
    await stopMetronome();
    await audioCtx.resume();
    soundMaker(660, 1, durationOfSound, audioCtx.currentTime, manualCount);
  } else if (clicks < durNumsArr.length + 1) {
    soundMaker(440, 0.9, durationOfSound, audioCtx.currentTime, manualCount);
  }
  // Visual indication
  if (clicks < durNumsArr.length + 1) {
    manualBtn.textContent = "End beat " + clicks;
    showActiveBeatVisually(manualCount);
  } else {
    manualBtn.textContent = "Record";
  }
  
  if (!lastTime) {
    lastTime = performance.now();
    startTime = lastTime;
    return;
  }

  manualBeatsDuration.push(parseInt(performance.now() - lastTime));
  lastTime = performance.now();

  if (clicks > durNumsArr.length) {
    changeDurNumsArrToManualBeatsDuration();

    updateDurationContainers(durNumsArr);
    updatePercentageLabels();
    updateTempo(bpm);
    updateCycleVisualizer() 

    // Resets
    clicks = 0;
    lastTime = null;
    startTime = null;
    manualBeatsDuration.length = 0;
    manualBtn.textContent = "Record";
    hideBeatVisually();
  }
});

// Duration section
function addEventToDurationContainers() {
  let durationContainers = document.querySelectorAll(".durationContainer");
  durationContainers.forEach((container, i) => {
    const slider = container.querySelector("input[type='range']");
    const numInput = container.querySelector(".numInput");

    container.addEventListener("input", (e) => {
      if (e.target.type === "range") {
        numInput.value = slider.value;
        durNumsArr[i] = parseInt(slider.value);
      } else if (e.target.type === "number") {
        if (numInput.value > 1000) numInput.value = 1000
        else if (!numInput.value) numInput.value = 1;
        slider.value = numInput.value;
        durNumsArr[i] = parseInt(numInput.value);
      }
      updatePercentageLabels();
      updateCycleVisualizer();

    });

    container.addEventListener("change", (e) => {
      if (e.target.type === "range" && isRunning) {
        restartMetronome()
      };
    });
  });
}

addDurationContainer(2)
addDurationContainer(3)
addEventToDurationContainers();


// Tempo section
let tempoRange = document.querySelector("#tempoRange");
tempoRange.addEventListener("input", () => {
  bpm = parseInt(tempoRange.value);
  interval = 60 / bpm;
  updateTempo(bpm);
});
tempoRange.addEventListener("change", () => {
  if (isRunning) {
    restartMetronome();
  }
});
let clickCount = 0;
const increaseBeatBtn = document.querySelector("#increaseBeatBtn");
increaseBeatBtn.addEventListener("click", () => {
  if (bpm >= 600) return;
  changeTempoByOne("+");
  updateTempo(bpm);
  restartMetronome();
});

const decreaseBeatBtn = document.querySelector("#decreaseBeatBtn");
decreaseBeatBtn.addEventListener("click", () => {
  if (bpm <= 1) return;
  changeTempoByOne("-");
  updateTempo(bpm);
  restartMetronome();
});

// Function section
function changeDurNumsArrToManualBeatsDuration() {
  durNumsArr = [...manualBeatsDuration];
  const totalTime = durNumsArr.reduce((t, c) => t + c);
  interval = totalTime / durNumsArr.length;
  interval *= 0.001;
  bpm = (1 / interval) * 60;
  bpm = bpm.toFixed(0);

  while (manualBeatsDuration.some((v) => v > 1000)) {
    manualBeatsDuration = manualBeatsDuration.map((v) => Math.round(v * 0.9));
  }

  durNumsArr = [...manualBeatsDuration];
}

function updateDurationContainers(arr) {
  let durationContainers = document.querySelectorAll(".durationContainer");
  durationContainers.forEach((container, i) => {
    const slider = container.querySelector("input[type='range']");
    const numInput = container.querySelector("input[type='number']");
    numInput.value = arr[i];
    slider.value = arr[i];
  });
}

function changeTempoByOne(operator) {
  operator === "+" ? bpm++ : bpm--;
  tempoRange.value = bpm;
  interval = 60 / bpm;
}

function updateTempo(val) {
  const tempoLabel = document.querySelector("#tempoLabel");
  const tempoRange = document.querySelector("#tempoRange");
  tempoLabel.textContent = val;
  tempoRange.value = val;
  bpm = val;
  interval = 60 / bpm;
}

function removeFromDurNumsArr() {
  durNumsArr.pop();
  durNumsTotal = durNumsArr.reduce((t, c) => t + c);
}

function addToDurNumsArr() {
  durNumsTotal = durNumsArr.reduce((t, c) => t + c);
  durNumsArr.push(durNumsArr[durNumsArr.length - 1]);
}

function updateNumOfBeatsDisplay() {
  const numOfBeatsDisplay = document.querySelector("#numOfBeatsDisplay");
  numOfBeatsDisplay.textContent = durNumsArr.length;
}

function showActiveBeatVisually(i) {
  const prevactiveBeat = document.querySelector(".active");
  if (prevactiveBeat) {
    prevactiveBeat.classList.remove("active");
  }
  const visualBeats = document.querySelectorAll(".visualBeats");
  try {
    visualBeats[i].classList.add("active");
  } catch {
    restartMetronome();
  }
}

function hideBeatVisually() {
  try {
    const prevactiveBeat = document.querySelectorAll(
      ".visualBeats" + ".active"
    )[0];
    prevactiveBeat.classList.remove("active");
  } catch {}
}

function addVisualBeatToDOM() {
  const div = document.createElement("div");
  div.classList.add("visualBeats");
  div.classList.add(durNumsArr.length);
  const visualBeatsContainers = document.querySelector(
    "#visualBeatsContainers"
  );
  visualBeatsContainers.appendChild(div);
}

function removeVisualBeatFromDOM() {
  const visualBeatsContainers = document.querySelector(
    "#visualBeatsContainers"
  );
  visualBeatsContainers.removeChild(visualBeatsContainers.lastElementChild);
}

function addDurationContainer(i) {
  const duration = document.querySelector("#duration");
  const durationContainers = document.querySelectorAll(".durationContainer");
  const section =
    durationContainers[durationContainers.length - 1].cloneNode(true);
  section.classList.add("durationContainer");

  const inputNum = section.querySelector("input[type='number']");
  inputNum.id = "durationNum" + i;
  inputNum.classList.add("numInput");
  const labelForNums = section.querySelector(".labelForNums");
  labelForNums.htmlFor = inputNum.id;

  const durationRange = section.querySelector("input[type='range']")
  durationRange.id = "durationRange" + i;
  const labelForRanges = section.querySelector(".labelForRanges");
  labelForRanges.htmlFor = durationRange.id;
  duration.appendChild(section);
}

function removeDurationContainer() {
  const duration = document.querySelector("#duration");
  duration.removeChild(duration.lastElementChild);
}

function updatePercentageLabels() {
  const labelForNums = document.querySelectorAll(".labelForNums");
  const labelForRanges = document.querySelectorAll(".labelForRanges")
  try {
    durNumsTotal = durNumsArr.reduce((t, c) => t + c);
  } catch {
    durNumsTotal = 0;
  }
  for (let i = 0; i < labelForNums.length; i++) {
    let percent = durNumsArr[i] / durNumsTotal;
    percent = (percent * 100).toFixed(1);
    labelForNums[i].textContent = percent + " %";
    labelForRanges[i].textContent = percent + " %";
  }
}

async function restartMetronome() {
  await stopMetronome();
  await startMetronome()
}