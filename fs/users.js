import { initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

if (sessionStorage.getItem("loggedIn") == null || sessionStorage.getItem("loggedIn") == "false") {
    window.location.href = "./index.html";
  }
  
if (sessionStorage.getItem("User") == "admin"){
  document.getElementsByClassName("adminNavBar")[0].style.display = "block";
}

if (sessionStorage.getItem("User") != "admin") {
  window.location.href = "./index.html";
}

const firebaseConfig = { databaseURL: 'https://oebcalendar-c34e0-default-rtdb.firebaseio.com' };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const users = ref(database, 'posts/users');
onValue(users, (snapshot) => {
  generate_users(snapshot.val());
});

function generate_users(all_users) {
  
  for (var i = 0; i < objLength(all_users); i++){
    var email = Object.keys(all_users)[i];
    var new_user_div = document.createElement('div');
    new_user_div.classList.add("user");
    // new_user_div.innerHTML += `<button class="changeButton" onClick="changeUserInfo('${email}')">Change</button>
    new_user_div.innerHTML += `<button class="collapsible">Email: ${email}</button>`
    var all_info = all_users[email][Object.keys(all_users[email])[0]];

    new_user_div.innerHTML += `<div class="userInfo">
    <p>Email: ${email}</p>
    <p>Password: ***************</p>
    <p>Team: ${all_info['team']}</p>
    </div>`

    document.getElementsByClassName("allUsers")[0].appendChild(new_user_div);
  }

  var coll = document.getElementsByClassName("collapsible");

  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

// helper function to find object length 
function objLength(obj) {
  let count = 0;

  for (var elem in obj) {
    count++;
  }

  return count;
}

window.changeUserInfo = function (email) {
  console.log(email);
}