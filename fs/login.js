window.loginUser = function (){
    var username = document.getElementById("inputUser").value;
    var password = document.getElementById("inputPassword").value;
    var encoded_username = encodeKey(username);
    if (username != ""){
        fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
        .then(res => res.json())
        .then(async data => {
            let databaseUserInfo = data["users"][encoded_username]; // point to the day clicked
            // Check if user exists
            if (databaseUserInfo == null){
                alert("User does not exist!");
                return;
            }

            let saved_data = databaseUserInfo[Object.keys(databaseUserInfo)[0]];
            
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
            window.location.href = "./calendar.html";
        });
    }
  }
  
window.createAcc = function () {
    window.location.href = "./register.html";
}

function encodeKey(s) {
    return encodeURIComponent(s).replace(/\./g, '%2E');
}