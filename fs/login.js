window.loginUser = function (){
    var username = document.getElementById("inputUser").value;
    var password = document.getElementById("inputPassword").value;
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
            sessionStorage.setItem("User", username);
            sessionStorage.setItem("Team", saved_data['team']);
            sessionStorage.setItem("loggedIn", "True");
            // window.location.href = "https://talhahafeez1.github.io/calendar.html";
            window.location.href = "./calendar.html";
        });
    }
  }
  
window.createAcc = function () {
    // window.location.href = "https://talhahafeez1.github.io/register.html";
    window.location.href = "./register.html";
}