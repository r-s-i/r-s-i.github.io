/*Turns "document.querySelector('ref')" to "$('ref')":*/
function $(ref) {
  return document.querySelector(ref);
}

/*Set up blackOrWhiteBg, it's used inside of run():*/
let allElements = $("*");
allElements.style.backgroundColor = "black";
allElements.style.color = "white";
let blackOrWhiteBg = "black";
function getColorForBg(bg) {
  if (bg == "white") {
    blackOrWhiteBg = "white";
  }
  else {
    blackOrWhiteBg = "black";
  }
}

function getFont(font) {
  let x;
  if (font == "serif") {
    x = `"Times New Roman", Times, serif`;
  }
  else if (font == "sans_serif") {
    x = `Arial, Helvetica, sans-serif`;
  }
  else {
    x = `"Courier New", monospaced`;
  }
  $("#output").style.fontFamily = x;
}

/*Footnote toggle:*/
isFootnotesOn = true;
function toggle() {
    isFootnotesOn = !isFootnotesOn;
}

/*Applying user selected pixels:*/
function ApplyingPixels() {
  let selectedPixels = $("#px").value;
  $("#output").style.fontSize = `${selectedPixels}px`;
}

let currentWord;
let interFunc;
let userInput;
let shownWords = [];
let userInputArr = [];
let intervalInMill;
function run(arr) {
  ApplyingPixels();
  function counter(counterArr) {
    let i = 0;
    interFunc = setInterval(function() {
      currentWord = counterArr[i];
      shownWords.push(currentWord);
      $("#output").innerHTML = currentWord;
      if (currentWord == undefined) {
        shownWords.pop(); // Removes "undefined".
        doneReading = true; // Used in pause().
        window.clearInterval(interFunc);
        $("#output").innerHTML = "";
        $("#options").style.display = "block";
        return;
      }
      i++;
    }, intervalInMill);
  }

  /*Changes bg color and text color to user's choice:*/
  if (blackOrWhiteBg == "black") {
    allElements.style.backgroundColor = "black";
    allElements.style.color = "white";
  }
  else {
    allElements.style.backgroundColor = "white";
    allElements.style.color = "black";
  }

  /*Shows the output_section:*/
  $("#output_section").style.display = "flex";

  /*Assigns only when the user clicks "Run":*/
  if (arr == undefined) {
    userInput = $('#userInput').value;
    let userSelectedWmp = $("#wpm").value;
    intervalInMill = 1000 / ((userSelectedWmp / 60)); // Turns wps to milliseconds.

    /*Replaces new lines with space:*/
    userInput = userInput.replaceAll("\n", " "); // Line feed.
    /*Splits up words to make more digestible:*/
    userInput = userInput.replaceAll('."','." '); // Dialog.
    userInput = userInput.replaceAll(`,"`, `," `); // Dialog.
    userInput = userInput.replaceAll("-","- "); // Hyphen.
    userInput = userInput.replaceAll("–","– "); // En dash.
    userInput = userInput.replaceAll("—"," — "); // Em dash.
    userInput = userInput.replaceAll("/"," / "); // Em dash.

    /*Makes userInput into an array:*/
    userInputArr = userInput.split(" ");
    
    /*Removes footnotes (eks: [1]):*/
    if (!isFootnotesOn) {
      const footnoteRemover = (arr)=> {
       for (let i = 0; i < arr.length; i++) {
        while (arr[i].includes("[") && arr[i].includes("]")) {
          arr[i] = arr[i].slice(0, arr[i].indexOf("[")) + arr[i].slice(arr[i].indexOf("]")+1, arr.length-1);
        }
       }
      };
      footnoteRemover(userInputArr);
      
    }
    /*Removes " ":*/
    const spaceRemover = (value) => {
      return value.length >= 1;
    };
    userInputArr = userInputArr.filter(spaceRemover);

    // Hides headline, input section, and footer:
    $("#h1").style.display = "none";
    $("#input_section").style.display = "none";
    $("footer").style.display = "none";
    counter(userInputArr);
  }
  else {
    counter(arr);
  }
}

function reset() {
  paused = false;
  doneReading = false; // Used in pause();
  newUserInputArr = [];
  shownWords = [];

  /*Hides the output_section:*/
  $("#output_section").style.display = "none";

  // Shows headline, input section, and footer:
  $("#h1").style.display = "block";
  $("#input_section").style.display = "block";
  $("footer").style.display = "block";

  /* Hides the reread and reset buttons:*/
  $("#options").style.display = "none";

  /*Make sure the "start screen" always have a black bg and white text:*/
  allElements.style.backgroundColor = "black";
  allElements.style.color = "white";
}

/*Event listners:*/
/*Open button, settings:*/
$("#open_settings").addEventListener("click", function() {
  $("#settings").style.display = "block";
});

/*Close button, settings:*/
$("#close_settings").addEventListener("click", function() {
  $("#settings").style.display = "none";
});

/*Pauses while reading:*/
 let paused = false;
 let doneReading = false;
 let newUserInputArr = [];
 $("#output_section").addEventListener("click", function pause() {
   if (doneReading) {
     return;
   }
   else {
     paused = !paused;
     /*Pauses the program:*/
     if (paused) {
       window.clearInterval(interFunc);
       newUserInputArr = userInputArr.slice(shownWords.length, userInputArr.length);
     }
     /*Restarts the program:*/
     else {
       run(newUserInputArr);
     }
   }
 });

/*Resets:*/
$("#reset_button").addEventListener("click", function() {
   reset();
});

/*Starts rereading the text:*/
$("#read_again_button").addEventListener("click", function() {
  $("#options").style.display = "none";
  doneReading = false; // Used in pause();
  run(shownWords);
  shownWords = [];
});
