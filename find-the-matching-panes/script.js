function game() {
    // Setup:
    // General:
    const sectionChildren = document.querySelector("#grid-container").children;
    const loopLength = sectionChildren.length;
    let hiddenLetters = [];
    for (let i = 0; i < loopLength/2; i++) {
      hiddenLetters.push(String.fromCharCode(65+i));
      hiddenLetters.push(String.fromCharCode(65+i))
    }
    // For hiddenLettersScrambled:
    const scrambleHiddenLetters = [];
    // For paneTracker:
    const lastPane = []; 
    const lastIndex = [];
    let foundLetters = [];
    let isGameOver = false;
  
    (
      function hiddenLettersScrambled() {
        for (let i = 0; i < loopLength; i++) {
          let hiddenLettersIndex = Math.floor(Math.random() * hiddenLetters.length);
          scrambleHiddenLetters[i] = hiddenLetters[hiddenLettersIndex];
          hiddenLetters.splice(hiddenLettersIndex, 1); // deletes used letter;
        }
      }
    )();

    (
      function matchLettersAndPanes() {
        for (let i = 0; i < loopLength; i++) {
          sectionChildren[i].id = scrambleHiddenLetters[i]
        }
      }
    )()
    
    /*Read/print output, used for text-to-speech:*/
    function readOutLoud(letter, isMatched=false) {
      document.getElementById("messages").innerHTML = "";
     
      if (isMatched) {
        setTimeout(() => {document.getElementById("messages").innerHTML = `You matched the ${letter}'s`;}, 10);
        setTimeout(() => {document.getElementById("messages").innerHTML = "";}, 2000);
      }
      else {
        document.getElementById("messages").innerHTML = letter;
      }    
    }

    
    function hideLetters() {
      for (let i = 0; i < loopLength; i++) {
        if (foundLetters.includes(sectionChildren[i].id)) {
          sectionChildren[i].style.backgroundColor = "green";
          sectionChildren[i].style.cursor = "not-allowed";
          sectionChildren[i].disabled = true;
        }
        else {
          sectionChildren[i].innerText = i+1;
        }    
      }
    }

    function paneTracker(pane, i) {
      // Checks if both letters are found:
      lastIndex.push(i);
      lastPane.push(pane);

      if (pane === lastPane[0] && lastPane.length !== 1 && i !== lastIndex[0] && !foundLetters.includes(pane)) {
        foundLetters.push(pane);  
        if (foundLetters.length < loopLength/2) {
          readOutLoud(pane, true);
        }
        else {
          isGameOver = true;
        }
      }
      // If not matched, print out the selected pane:
      else {
        readOutLoud(pane);
      }

      // Keep both lastPane and lastIndex to a length of one:
      if (lastPane.length >= 2) {
          lastPane.shift();
      }
      if (lastIndex.length >= 2) {
          lastIndex.shift();
      }

      // Game is over. Show message and reload:
      if (isGameOver) {
        setTimeout(() => {document.getElementById("messages").innerHTML = "Congratulations!";}, 10);
        setTimeout(() => {document.getElementById("messages").innerHTML = "Play again?";}, 2500);
        setTimeout(() => {location.reload()}, 5000);
        return
      }
      return pane;
    }

    (
      function whenClickedReplaceNumberWithLetter() {
        for (let i = 0; i < loopLength; i++) {
          // When clicked, replace number with letter:
          sectionChildren[i].onclick = ()=> {  
            paneTracker(sectionChildren[i].id, i);
            hideLetters();      
            sectionChildren[i].innerText = sectionChildren[i].id;
          }
        }
      }
    )()
  }
game();
