/*For manipulating the DOM:*/
let text = document.getElementById("text");
let clock = document.getElementById("clock");
let finishedWorkSession = document.getElementById("Finished_work_session");
let pauseButton = document.getElementById("pause");
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
/*From settings, input:*/
let workDuration;
let shortBreakDuration;
let longBreakDuration;
let workSessionsBeforeLongBreak;
/*Setting permissions, checkbox:*/
let isSoundOn = false;
let isNotificationOn = false;
let isAutoPauseOn = false;
/*Resets the app by reloading the page*/
function reset() {
  location.reload();
}
/* If user click checkbox, turn on/off said checkbox:*/
function checkboxClicked(x) {
  switch (x) {
    case 1:
      isSoundOn = !isSoundOn;
      break;
    case 2:
      isNotificationOn = !isNotificationOn;
      if (isNotificationOn && Notification.permission == "default") {
        Notification.requestPermission();
      }
      break;
    case 3:
      isAutoPauseOn = !isAutoPauseOn;
      break;
  }
}
/*If true return "On", if false return "Off":*/
function returnOnOrOf(bool) {
  if (bool) {
    return "On";
  } else {
    return "Off";
  }
}
/*Start button:*/
let workCounter = 0;
let clickedStart = false;
function start() {
  clickedStart = true;
  /*Replaces the start button with the reset button:*/
  startButton.style.display = "none";
  resetButton.style.display = "block";
  /*From settings, input:*/
  workDuration = document.getElementById("work_duration_input").value;
  shortBreakDuration = document.getElementById("sbreak_duration_input").value;
  longBreakDuration = document.getElementById("lbreak_duration_input").value;
  workSessionsBeforeLongBreak = document.getElementById(
    "how_long_before_lbreak_input"
  ).value;
  /*Starts the timer:*/
  timer(workDuration, "Work");
  workCounter++;
  /*Hides the editable settings:*/
  document.getElementById("settings").style.display = "none";
  /*Transfer the editiable settings to chosen settings:*/
  /*Sound:*/
  document.getElementById("from_sound_checkbox").innerHTML =
    returnOnOrOf(isSoundOn);
  /*Notification:*/
  document.getElementById("from_notification_checkbox").innerHTML =
    returnOnOrOf(isNotificationOn);
  /*Auto pause:*/
  document.getElementById("from_auto_pause_checkbox").innerHTML =
    returnOnOrOf(isAutoPauseOn);
  /*Work duration:*/
  document.getElementById("from_work_duration_input").innerHTML = workDuration;
  /*Short break duration:*/
  document.getElementById("from_sbreak_duration_input").innerHTML =
    shortBreakDuration;
  /*Long break duration:*/
  document.getElementById("from_lbreak_duration_input").innerHTML =
    longBreakDuration;
  /*Work interval(s) before long break:*/
  document.getElementById("from_how_long_before_lbreak_input").innerHTML =
    workSessionsBeforeLongBreak;
  /*Shows the chosen settings:*/
  document.getElementById("chosen_settings").style.display = "block";
} // End of start().

/*timer():*/
let globalType; // Used in pause().
function timer(min, type) {
  globalType = type;
  /*countsDown():*/
  timePlussNow = new Date().getTime() + 1000 * 60 * min;
  function countsDown() {
    let timeRightNow = new Date().getTime();
    let timeDiff = timePlussNow - timeRightNow;
    let m = Math.floor(timeDiff / 60000);
    let s = Math.floor((timeDiff % 60000) / 1000);
    /*Makes single digit to double:*/
    /*For secounds:*/
    for (let i = 0; i <= 9; i++) {
      switch (s) {
        case i:
          s = "0" + i;
          break;
      }
    }
    /*For minutes:*/
    for (let i = 0; i <= 9; i++) {
      switch (m) {
        case i:
          m = "0" + i;
          break;
      }
    }
    /*Displays the clock to the user:*/
    clock.innerHTML = `${m}:${s}`;
    clock.style.display = "block";
    text.innerHTML = `${type}`;
    if (m <= 0 && s <= 0) {
      clearInterval(x);
      if (isSoundOn) {
        document.getElementById("audio").play();
      }
      if (isNotificationOn && Notification.permission == "granted") {
        new Notification(`${type} is over`);
      }
      /*Resets the timer:*/
      if (type == "Work" && workCounter % workSessionsBeforeLongBreak != 0) {
        // Displays the workCounter to user:
        finishedWorkSession.innerHTML = workCounter;
        timer(shortBreakDuration, "Short break");
        if (isAutoPauseOn) {
          pause();
        }
      }
      if (type == "Work" && workCounter % workSessionsBeforeLongBreak == 0) {
        // Displays the workCounter to user:
        finishedWorkSession.innerHTML = workCounter;
        timer(longBreakDuration, "Long break");
        if (isAutoPauseOn) {
          pause();
        }
      }
      if (type == "Short break" || type == "Long break") {
        workCounter++;
        timer(workDuration, "Work");
        if (isAutoPauseOn) {
          pause();
        }
      }
    }
    /*Pauses the timer, saves the time left:*/
    if (isPaused) {
      timeAfterPause = timeDiff / 60000;
      clearInterval(x);
    }
  }
  let x = setInterval(countsDown, 100);
  countsDown();
} // End of timer().

/*Pause button:*/
let timeAfterPause;
let isPaused = false;
function pause() {
  /*Makes pause button unclickable before clicking the  
  start button:*/
  if (!clickedStart) {
    return;
  }
  isPaused = !isPaused;
  /*Turns "Pause" into "Unpause":*/
  if (isPaused) {
    pauseButton.innerHTML = "Unpause";
  }
  if (!isPaused) {
    timer(timeAfterPause, globalType);
    pauseButton.innerHTML = "Pause";
  }
} // End of pause().

/*Hides notification option if not supported:*/
if (!window.Notification) {
  document.getElementById("notification_setting").style.display = "none";
  document.getElementById("chosen_settings_notification").style.display =
    "none";
}
