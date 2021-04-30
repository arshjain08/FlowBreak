let turn = 0;
let tab;
let coins = 0;
let websiteClicked = true;
function workTimer() {
    let workTime = document.getElementById("workL").value;
    workTime = minutesToSeconds(workTime);
    let breakTime = document.getElementById("breakL").value;
    breakTime = minutesToSeconds(breakTime);
    let extraTime = document.getElementById("longbreakL").value;
    extraTime = minutesToSeconds(extraTime);
    if(workTime<=0 || breakTime<=0 || extraTime<=0 || workTime != Math.floor(workTime) || breakTime != Math.floor(breakTime) || extraTime != Math.floor(extraTime)){
        Swal.fire(
          'There was an error',
          'Make sure that the times are positive numbers that can be turned into seconds evenly',
          'warning'
        )
        return;
    }
  
    turn++;
    
    document.getElementById("worktimer").style.display = "inline-block";
    document.getElementById("breaktimer").style.display = "none";
    removeTimer();
    createdivTimer("appcapsule1");
    createTimer(workTime, "app");
    startTimer(workTime);
  }

function breakTimer(){
    turn++;
    document.getElementById("datainput").style.display = "none";
    document.getElementById("worktimer").style.display = "none";
    document.getElementById("breaktimer").style.display = "block";
}

function openWebsite(websiteurl){
  if(websiteClicked){
    return;
  }
  if(!websiteurl.includes("https://") && !websiteurl.includes("http://")){
    Swal.fire(
      'Uh Oh!',
      'Remember to add an https:// in the front :)',
      'error'
    )
    return;
  }
  websiteClicked = true;
  tab = open(websiteurl);
  let breakTime = document.getElementById("breakL").value;
  let extrabreakTime = minutesToSeconds(document.getElementById("longbreakL").value);
  breakTime = minutesToSeconds(breakTime);
  removeTimer();
  createdivTimer("appcapsule2");
  console.log("turn",turn)
  if (turn%8==0){
    createTimer(extrabreakTime);
    startTimer(extrabreakTime);
  }
  else{
    createTimer(breakTime);
    startTimer(breakTime);
  }
  return;
}

function stopTimer (){
  if (localStorage.getItem("coins")==null){
    localStorage.setItem("coins", coins);
  }
  else{
    localStorage.coins = Number(localStorage.coins)+coins;
  }
  Swal.fire(
    'Good job!',
    'You worked hard! You got ' + coins + " coins!",
    'success'
  )
  .then(() => {
    window.location.reload();
  })
  
  console.log(localStorage.getItem("coins"))

}
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let timePassed = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

function createTimer(timeLeft){ //creates the circle timer 
    document.getElementById("app").innerHTML = `
    <div class="base-timer" style="margin: auto;">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            "
        ></path>
        </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    </div>
    `;
}

function removeTimer(){
  let elem = document.getElementById("app");
  elem.remove();
}

function createdivTimer(appcapsule){
  document.getElementById(appcapsule).innerHTML = '<div id="app"></div>'
}

function onTimesUp() { //stops the loop when the time ends
  clearInterval(timerInterval);
  document.title = "FlowBreak";
  websiteClicked = false;
  if(turn%2 == 0){
    tab.close();
    workTimer();
  }
  else{
    breakTimer();
  }
}

function startTimer(workTime) {
  let timePassed = 0;
  let timeLimit = workTime;
  let timeLeft = timeLimit;
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1; 
    coins++;
    timeLeft = timeLimit - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray(timeLimit, timeLeft);
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  console.log(time);
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  document.title = `${minutes}:${seconds}`;

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction(timeLimit, timeLeft) {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray(timeLimit, timeLeft) {
  const circleDasharray = `${(
    calculateTimeFraction(timeLimit, timeLeft) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function minutesToSeconds(minutes){
    let seconds = minutes*60;
    return(seconds)
}

