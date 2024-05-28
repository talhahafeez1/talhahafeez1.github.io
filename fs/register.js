function login() {
    // window.location.href = "https://talhahafeez1.github.io/index.html";
    window.location.href = "./index.html";
}

function createUser() {
    let username = document.getElementById("inputregisterUser").value;
    let password = document.getElementById("inputregisterPassword").value;
    let team = document.getElementById("inputregisterTeam").value;

    fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
        .then(res => res.json())
        .then(async readData => {
        parseData = readData["users"]; // point to the day clicked

        if (parseData[username] != null) {
            alert("Another user with the email entered already exists!");
            return;
        }
        for (let i = 0; i < objLength(parseData); i++){
            user = parseData[Object.keys(parseData)[i]];
            value = user[Object.keys(user)[0]];
            if (value["team"] == team){
                alert("Another user with the team entered already exists");
                return;
            }
        }

        //generates its own unique key in the form of month, day, match number (1 to n)
        await fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts/users/' + username + '.json/?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"pass": password, "team": team, "admin": false}) // actual content being written to db from form submission
        });

        // window.location.href = "https://talhahafeez1.github.io/index.html";
        window.location.href = "./index.html";
    });
}

function objLength(obj) {
    let count = 0;
  
    for (elem in obj) {
      count++;
    }
  
    return count;
}