// database.on('child_changed', function(snapshot){
//     var data = snapshot.val();

//     var content = '<tr id="'+snapshot.key+'">';
//     content += '<td>' + data.CustomerName + '</td>';//column2
//     content += '<td>' + data.TimeEffected + '</td>'; //column1 
//     content += '<td>' + data.DateEffected + '</td>'; //column1
//     content += '<td>' + data.Successful + '</td>'; //column1
//     content += '</tr>';

//     $('#'+snapshot.key).replaceWith(content)
// });

import firebase from "firebase";

function loginUser(){
    username = document.getElementById("inputUser").value;
    password = document.getElementById("inputPassword").value;
    if (username != ""){
        fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
        .then(res => res.json())
        .then(async data => {
            let databaseUserInfo = data["users"][username]; // point to the day clicked
            let saved_data = databaseUserInfo[Object.keys(databaseUserInfo)[0]];
            // Check if user exists
            if (databaseUserInfo == null){
                alert("User does not exist!");
                return;
            } 
            
            // Check if password matches database saved password
            if (saved_data['pass'] != password){
                alert("Password is not correct! Please try again!");
                return;
            }
  
            sessionStorage.setItem("col", "#167e56");

            // Check if user is an admin
            if (saved_data['admin']){
                sessionStorage.setItem("col", "red");
            }

            sessionStorage.setItem("loggedIn", "True");
            // window.location.href = "https://talhahafeez1.github.io/calendar.html";
            window.location.href = "./calendar.html";
        });
    }
  }
  
  function createAcc() {
    // window.location.href = "https://talhahafeez1.github.io/register.html";
    window.location.href = "./register.html";
  }

globalThis.createAcc = createAcc;
globalThis.loginUser = loginUser;