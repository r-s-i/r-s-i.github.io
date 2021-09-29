let areInGroup = false;
let output;
let num = 15; // for showPercentChange

// Easier to select element:
function $(id) {
  return document.getElementById(id);
}

(function showPercentChange() {
  $("percent_label").innerHTML = "Percentage: " + num + "%";

  /*Updates the percentage displayed when slider is being moved.*/
  $("calculator_proper").addEventListener("mousemove", function() {
    num = $("percentage").value;
    $("percent_label").innerHTML = "Percentage: " + num + "%";
  })
  /*If the user clicks somewhere in the range:*/
  $("calculator_proper").addEventListener("click", function() {
    num = $("percentage").value;
    $("percent_label").innerHTML = "Percentage: " + num + "%";
  })
})()

function hideOrShow(value) {
  if (value == "yes") {
    $("group_question_answered").style.visibility = "visible";
    areInGroup = true;
  } else {
    $("group_question_answered").style.visibility = "hidden";
    areInGroup = false
  }
}

function calculate() {
  // Getting values from the user:
  let price = Number($("price").value);
  let percentage = Number($("percentage").value);
  let persons = Number($("num_of_persons").value);

  // Stops the user if group is true, but persons input is left blank:
  if (areInGroup && persons <= 1) {
    output = `How many were in the group?`
    $("info_and_output").innerHTML = output;
    return;
  }

  // stops the user if the price is 0:
  if (price == 0) {
    output = "In order for this to work, I need to know the cost of the meal."
    $("info_and_output").innerHTML = output;
    return;
  }

  let tip = Number(price * (percentage / 100));
  let totalPrice = Number(price + tip);
  let splitTotalPrice = Number(totalPrice / persons);
  /*Rounds up:*/
  tip = Math.ceil(tip.toFixed(2));
  totalPrice = Math.ceil(totalPrice.toFixed(2));
  splitTotalPrice = Math.ceil(splitTotalPrice.toFixed(2));

  // Displayes the result to the user:
  output = `The <strong>price</strong> was <strong>${price}</strong>. With a <strong>percent</strong> of <strong>${percentage}</strong>, the rounded up <strong>tip</strong> will be <strong>${tip}</strong>. And the  rounded up <strong>total price</strong> will be <strong>${totalPrice}</strong>.`;

  if (areInGroup) {
    output += ` In a group of ${persons} people, each person pays the rounded up <strong>amount</strong> of <strong>${splitTotalPrice}</strong>.`;
  }
  $("info_and_output").innerHTML = output;
}
