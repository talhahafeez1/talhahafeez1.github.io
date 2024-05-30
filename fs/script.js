import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

if (sessionStorage.getItem("loggedIn") == null) {
  window.location.href = "https://talhahafeez1.github.io/index.html";
}

setInterval(sendEmail, 5000);

function sendEmail(){
  emailjs.init('0PMfSj36yxORB9XWt');
  emailjs.send("service_njvq9sk","template_clhfrw2",{
    to_name: "talhahafeez03@gmail.com",
    message: "Current Time is: " + new Date().toLocaleTimeString(),
    });
}

// variables defined globally to provide event listener access 
let matchClicked = 0;
let searchKey = "";
let matchDay_saved = null;

const firebaseConfig = { databaseURL: 'https://oebcalendar-c34e0-default-rtdb.firebaseio.com' };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const write = ref(database, 'posts/write');
var write_data = [[]];
onValue(write, (snapshot) => {
  write_data[0] = snapshot.val();
  if (matchClicked != 0 && searchKey != "" && matchDay_saved != null){
    renderDetails(matchDay_saved);
    openForm(matchClicked);
  }
});

const read = ref(database, 'posts/read');
var read_data = [[]];
onValue(read, (snapshot) => {
  read_data[0] = snapshot.val();
  renderCalendar();
  if (matchClicked != 0 && searchKey != "" && matchDay_saved != null){
    renderDetails(matchDay_saved);
    openForm(matchClicked);
  }
});

document.getElementsByClassName("month")[0].style.backgroundColor = sessionStorage.getItem("col");

const date = new Date();

const monthDict = { 1: "January", 2: "February", 3: "March", 4: "April",
                    5: "May", 6: "June", 7: "July", 8: "August", 9: "September",
                    10: "October", 11: "November", 12: "December",
}


window.renderCalendar = function () {

  date.setDate(1);

  const monthDays = document.querySelector(".days"); //change the days 

  // Specific dates 
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const firstDayIndex = date.getDay();
  const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  const nextDays = 7 - lastDayIndex - 1;
  const months = [ // used for all the months
    "January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"
  ]

  // write month and date dynamically 
  document.querySelector('.date h1').innerHTML = months[date.getMonth()]
  document.querySelector('.date p').innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date"> ${prevLastDay - x + 1}</div>`
  }

  for (let i = 1; i <= lastDay; i++) { // print days from beginning to end
    if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
      days += `<div class="today" id="${i}" onclick="renderDetails(this.id)">${i}</div>`; // when elements are today
    } 
    
    else {
      var month_val = date.getMonth() + 1;
      var database_key = month_val + "" + i;
      if (month_val < 10){
        database_key = "0" + database_key;
      }
      if (database_key in read_data[0]) {
        days += `<div class="matchDay" id="${i}" onclick="renderDetails(this.id)"><u><strong>${i}</strong></u></div>`;
      } else {
        days += `<div>${i}</div>`;
      }
    } 
  }
    
  for (let j = 1; j <= nextDays; j++) { // print out the days of the next month differently
    days += `<div class="next-date">${j}</div>`
  }
  monthDays.innerHTML = days;
}

// dom event listener for form
const formEL = document.querySelector('.form');

// open form 
window.openForm = function (finalClick) {
  document.getElementById("myForm").style.display = "block"
  matchClicked = finalClick; // assign the match clicked to global variable

  let title = "Book an Exhibition Match" // dynamically written title 
  document.getElementById("title").innerHTML = title;

  let teamDetails = ""
  let parseData = write_data[0][searchKey + matchClicked]; // point to the specific match clicked on the day
  let loopCount = 1; // incremented counter for looping (use for team number header too) 
  for (var elem in parseData) { // output only the first two values 
    if (loopCount == 3) break; // base case 

    let teamName = parseData[elem].team; // define data pulled from json
    let teamEmail = parseData[elem].email;
    let teamCase = parseData[elem].case;

    teamDetails += `<div class='formTeam'> <h3>Team ${loopCount}</h3>  <b> Team: </b> ${teamName}</br> <b> Email: </b> ${teamEmail}</br> <b> Case: </b> ${teamCase}</br> </div>`;
    loopCount++;

    if (objLength(parseData) == 1) {
      teamDetails += `<div class='formTeam'> <h3>Team ${loopCount}</h3>  <b> Team: </b> TBA</br> <b> Email: </b> TBA </br> <b> Case: </b> TBA</br> </div>`;
    }
  }
  if (teamDetails != "") document.getElementById("formTop").innerHTML = teamDetails; // append and write html
}

// close form 
window.clearForm = function () {
  document.getElementById("myForm").style.display = "none"; // hide pop up form
  document.getElementById("submitForm").reset(); // empty the fields
  document.getElementById("formTop").innerHTML = "<div class='formTeam'><h3>Team 1</h3> <b> Team: </b> TBA</br> <b> Email: </b> TBA </br> <b> Case: </b> TBA</br></div><div class='formTeam'><h3>Team 2</h3> <b> Team: </b> TBA</br> <b> Email: </b> TBA </br> <b> Case: </b> TBA</br></div>"
}

// render the match details 
window.renderDetails = function (matchDay) { // show the details of the match
  matchDay_saved = matchDay;
  const matchDetails = document.querySelector(".matchDetails");
  const title = document.querySelector(".dayClicked");
  let keyMonth = date.getMonth() + 1; // getmonth() returns index value, increment by 1 to match real value
  title.innerHTML = `<h2>${monthDict[keyMonth]}, ${matchDay}</h2>`;
  keyMonth += "";
  if (keyMonth.length == 1) {
    keyMonth = "0" + keyMonth;
  }
  searchKey = ("" + keyMonth + matchDay); // concatenate two ints into a string, form search key
  let match = ""; // read from db to render match details unique to the day
  let parseData = read_data[0][searchKey]; // point to the day clicked
  for (let i = 1; i <= objLength(parseData); i++) {
    let start = parseData[i].start;
    let end = parseData[i].end;
    let moderator = parseData[i].moderator; // read from the parsed data
    let writeParse = write_data[0][searchKey + i]; // point to the day clicked
    if (objLength(writeParse) == 0) {
    match += `<p class="option1" onclick="openForm(this.id)" id="${i}"><b>Start Time:</b> ${start} </br> <b>End Time:</b> ${end} </br> <b>Moderator:</b> ${moderator}</p>`
    } else if (objLength(writeParse) == 1) {
      match += `<p class="option2" onclick="openForm(this.id)" id="${i}"><b>Start Time:</b> ${start} </br> <b>End Time:</b> ${end} </br> <b>Moderator:</b> ${moderator}</p>`
    } else if (objLength(writeParse) == 2) {
      match += `<p class="option3" onclick="openForm(this.id)" id="${i}"><b>Start Time:</b> ${start} </br> <b>End Time:</b> ${end} </br> <b>Moderator:</b> ${moderator}</p>`
    }
  }
  matchDetails.innerHTML = match;
}

// event listener to write form submissions to db
formEL.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(formEL);
  const data = Object.fromEntries(formData); // generate the data from the form
  let parseData = "";
  parseData = write_data[0][searchKey + matchClicked]; // point to the day clicked
  if (objLength(parseData) < 2) {
    //generates its own unique key in the form of month, day, match number (1 to n)
    fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts/write/' + searchKey + matchClicked + '.json/?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // actual content being written to db from form submission
    });
  } else {
    document.getElementById("popUp").style.display = "block";
  }
  clearForm(); // close and clear the form after submission successful 
});


document.getElementById("confirmButton").addEventListener('click', () => {
  document.getElementById("popUp").style.display = "none";
});


// event listeners to change months
document.querySelector('.prev').addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector('.next').addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

// helper function to find object length 
function objLength(obj) {
  let count = 0;

  for (var elem in obj) {
    count++;
  }

  return count;
}
