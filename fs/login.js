let color = "#167e56";

function loginUser(){
    username = document.getElementById("inputUser").value;
    password = document.getElementById("inputPassword").value;
    if (username != ""){
        fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
        .then(res => res.json())
        .then(async data => {
            let databaseUserInfo = data["users"][username]; // point to the day clicked
            
            // Check if user exists
            if (databaseUserInfo == null){
                window.alert("User does not exist!");
                return;
            } 
            
            // Check if password matches database saved password
            if (databaseUserInfo['pass'] != password){
                alert("Password is not correct! Please try again!");
                return;
            }
  
            // Check if user is an admin
            if (databaseUserInfo['admin']){
                color = "red";
            }
            window.location.href = "../calender.html";
        });
    }
}
  
function createAcc() {
    window.location.href = "../register.html";
}

export { color };