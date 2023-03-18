// Displays different greetings based on the time of day:
function greetVisiter() {
  const theCurrentHour = new Date().getHours();

  if (theCurrentHour < 6) {
    return "Hello, you're up early...or late";
  } else if (theCurrentHour < 12) {
    return "Good morning";
  } else {
    return "Good afternoon";
  }
}

document.getElementById("greeting").innerHTML = greetVisiter();

// Give the visiter an option to invert the colors:
const invertColors = {
  head: document.querySelector("head"),
  link: document.createElement("link"),
  img: document.querySelector("#color_inverter_img"),
  isDark: true,

  black() {
    // Change the colors:
    this.link.rel = "stylesheet"; 
    this.link.href = "./darkStyle.css";
    this.head.appendChild(this.link);
    // Change the button img:
    this.img.src = "./images/invert_colors_b_to_w.webp";
  },

  white() {
    // Change the colors:
    this.head.removeChild(this.link);
    // Change the button img:
    this.img.src = "./images/invert_colors_w_to_b.webp";
  }
}
invertColors.black();

const button = document.getElementById("color_inverter");
button.addEventListener("click", ()=>{
  if (invertColors.isDark) {
    invertColors.white();
    invertColors.isDark = false;
  }
  else {
    invertColors.black();
    invertColors.isDark = true;
  }
});

// Track the time since created date (19-apr-2022):
function timeTracker() {
  const milliOfADay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const dayCreated = new Date(2022, 3, 19);
  const diff = Math.floor((today - dayCreated) / milliOfADay);
  let str = `Created ${diff}`;
  str += (diff > 1) ? " days ago" : " day ago";
  
  return str;
}

document.getElementById("time_tracker").innerHTML = timeTracker();