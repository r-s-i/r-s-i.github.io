/*
 -  Move makeProblem to its own loaction.
  - Increase levels to 20.
*/
const { createApp } = Vue;

createApp({
  data() {
    return {
      answersArray: ["","","",""],
      panesArray: [
        "", "" , ""
      ],
      elapsedTime: 0,
      answersArePlaced: false,
      answer: 0,
      problem: "",
      points: 0,
      level: 0,
      lives: 3,
      timeCreated: Date.now(),
      intervalID: 0,
      isActive: false,
      isDone: false,
      reloads: false,
    };
  },
  methods: {
    setLevel() {
      switch(this.points) {
        case 0:
          this.level = 0;
          break;
        case 3:
          this.level = 1;
          break;
        case 6:
          this.level = 2;
          break;
        case 9:
          this.level = 3;
          break; 
        case 12:
          this.level = 4;
          break;  
        case 15:
          this.level = 5;
          break;  
        case 18:
          this.level = 6;
          break;  
        case 21:
          this.level = 7;
          break;        
        case 24:
          this.level = 8;
          break;
        case 27:
          this.level = 9;
          break;        
        case 30:
          this.level = 10;
          break;
        case 33:
            this.level = 11;
            break;
        case 36:
          this.level = 12;
          break;                               
        default:
          this.level = this.level;
          break;               
      }
    },
    makeProblem() {
      const minimizeTo2DecimalPlaces = (answer) => {
        const answerAsString = answer.toString();
        const index = answerAsString.indexOf(".");
        if (answerAsString.length - index - 1 > 2) {
          this.makeProblem();
        }
      };
      const reduceDifficultyOfMultipication = (answer, number) => {
        if (answer > number) {          
          this.makeProblem();
        }
      };
      this.setLevel(); 
      let int1 = Math.floor(Math.random()*9) + 1;
      let int2 = Math.floor(Math.random()*9) + 1;       
      let int3 = Math.floor(Math.random()*9) + 1;    
      let int4 = Math.floor(Math.random()*9) + 1; 
      if (this.level === 0) {       
        this.problem = `${int1} + ${int2}`;
        this.answer = int1 + int2;
      } 
      else if (this.level === 1) {        
        this.problem = `${int1} + ${int2} + ${int3}`;
        this.answer = int1 + int2 + int3;
      }
      else if (this.level === 2) {             
        this.problem = `${int1} x ${int2}`;
        this.answer = int1 * int2;
      }
      else if (this.level === 3) {              
        this.problem = `${int1} x ${int2} x ${int3}`;
        this.answer = int1 * int2 * int3;
        reduceDifficultyOfMultipication(this.answer, 150);
      }
      else if (this.level === 4) {
        const isMultiSignFirst = 0.5 <= Math.random(); 
        if (isMultiSignFirst) {
          this.problem = `${int1} x ${int2} + ${int3}`;
          this.answer = int1 * int2 + int3;
        }   
        else {
          this.problem = `${int1} + ${int2} x ${int3}`;
          this.answer = int1 + int2 * int3;
        }                
      }
      else if (this.level === 5) {         
        this.problem = `${int1} - ${int2}`;
        this.answer = int1 - int2;
      }
      else if (this.level === 6) {        
        this.problem = `${int1} - ${int2} - ${int3}`;
        this.answer = int1 - int2 - int3;
      }
      else if (this.level === 7) {        
        this.problem = `${int1} / ${int2}`;
        this.answer = int1 / int2;
        minimizeTo2DecimalPlaces(this.answer);
      }
      else if (this.level === 8) {       
        this.problem = `${int1} / ${int2} / ${int3}`;
        this.answer = int1 / int2 / int3;
        minimizeTo2DecimalPlaces(this.answer);
      }      
      else if (this.level === 9) {       
        const isDiviSignFirst = 0.5 <= Math.random(); 
        if (isDiviSignFirst) {
          this.problem = `${int1} / ${int2} - ${int3}`;
          this.answer = int1 / int2 - int3;
          minimizeTo2DecimalPlaces(this.answer);
        }   
        else {
          this.problem = `${int1} - ${int2} / ${int3}`;
          this.answer = int1 - int2 / int3;
          minimizeTo2DecimalPlaces(this.answer);
        }   
      }
      else if (this.level === 10) {       
        const operations = ["/", "x", "-", "+"];
        const randomOperations = [];
        while(randomOperations.length < 3) {
          randomOperations.push(operations[Math.floor(Math.random()*4)]);
        }
        this.problem = `((${int1} ${randomOperations[0]} ${int2}) ${randomOperations[1]} ${int3}) ${randomOperations[2]} ${int4}`;

        const numbers = [int2, int3, int4];
        this.answer = int1;
        for (let i = 0; i < 3; i++) {
          if (randomOperations[i] === "/") {
            this.answer /= numbers[i];
          }
          else if (randomOperations[i] === "x") {
            this.answer *= numbers[i];
          }
          else if (randomOperations[i] === "-") {
            this.answer -= numbers[i];
          }
          else if (randomOperations[i] === "+") {
            this.answer += numbers[i];
          }                              
        }
        
        minimizeTo2DecimalPlaces(this.answer);
      }
      else if (this.level === 11) {
        this.problem = `${int1}^2`;
        this.answer = int1*int1;
      }
      else {
        this.message(true); // resets the game
      }    
      console.log(this.answer);
      return this.answer;

    },

    placeProblem(row) {
      const isTheRowClear = (pane0) => {
        return this.panesArray[pane0]==="";
      }
      const clearPreviousRow = (pane0) => {
        this.panesArray[pane0]="";
      }

      if (row === 0 && isTheRowClear(0)) {
        this.panesArray[0] = this.problem; 
      }
      else if (row === 1 && isTheRowClear(1)) {
        clearPreviousRow(0);
        this.panesArray[1] = this.problem; 
      }
      else if (row === 2 && isTheRowClear(2)) {
        clearPreviousRow(1);
        this.panesArray[2] = this.problem; 
      }
    },

    placeAnswers(answer) {
      this.answer = answer;
      let answers = [];
      const isDecimal = answer.toString().includes(".");
      if (this.answer === 0) {
        answers = [answer, 1, -1, 2];
      }
      else if (isDecimal) {
        answers = [answer.toFixed(2), (answer + (Math.random() <= 0.5 ? 2 : -2)).toFixed(2), (answer / 2).toFixed(2), (answer * 2).toFixed(2)];
      }
      else {
        answers = [answer, Math.round(answer + (Math.random() <= 0.5 ? 2 : -2)), Math.round(answer / 2), Math.round(answer * 2)];
      }
      
      while(answers.length > 0) {
        const randomIndex = Math.floor(Math.random()*4);
        if (this.answersArray[randomIndex] === "") {
          this.answersArray[randomIndex] = answers.pop();
        }
      }
    },

    checkAnswer(answer) {
      if (this.isDone) return;
      if (answer === this.answer || answer === this.answer.toFixed(2)) {
        this.points++;
        this.reset();
      }
      else {
        this.points--;
        this.lives--;
        this.reset();
      }
    },

    reset() {
      this.answersArray = ["","","",""];
      this.panesArray = ["", "" , ""];
      this.elapsedTime = 0;
      this.answersArePlaced = false;
      this.timeCreated = Date.now();
    },

    update() {     
      if (this.reloads && this.isDone) {
        this.isDone = false;
        location.reload();
        return;
      }
      if (this.isDone) {
        return;
      }
      if (this.lives < 1) {
        this.message(false);
      }
      if(!this.answersArePlaced) {
        this.placeAnswers(this.makeProblem());
        this.answersArePlaced = true;
        this.intervalID = setInterval(this.update, 500);
        
      }   
      if (this.elapsedTime < 3000) {
        this.placeProblem(0);
        this.isActive = false;
      }
      else if (this.elapsedTime < 6000) {
        this.placeProblem(1);
      }
      else if (this.elapsedTime < 9000) {
        this.placeProblem(2);
      }
      else if (this.elapsedTime < 10000) {
        this.isActive = true;
        this.panesArray = ["", "" , ""];
      }
      else {        
        clearInterval(this.intervalID);
        this.lives--;
        this.reset();
        this.update();
      }
      this.elapsedTime = Date.now() - this.timeCreated;
    },
    message(hasWon) {
      this.isDone = true;
      if (hasWon) {
        this.panesArray = [
          "You Won! Tap on",
          "RESET", "to play again"
        ];
      }   
      else {
        this.panesArray = [
          "You lost! Tap on",
          "RESET", "to play again"
        ];        
      }   
 
    },
  },
  created() {
    this.update();
  },


}).mount('#grid-container');