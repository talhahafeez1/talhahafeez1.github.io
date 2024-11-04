
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, set, update} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

if (sessionStorage.getItem("loggedIn") == null || sessionStorage.getItem("loggedIn") == "false") {
  window.location.href = "./index.html";
}

if (sessionStorage.getItem("User") == "admin"){
    document.getElementsByClassName("adminNavBar")[0].style.display = "block";
} else {
    window.location.href = "./index.html";
}

const firebaseConfig = { databaseURL: 'https://oebcalendar-c34e0-default-rtdb.firebaseio.com' };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const read = ref(database, 'posts/read');
var read_data = [[]];
onValue(read, (snapshot) => {
  read_data[0] = snapshot.val();
});

const cases = ref(database, 'posts/cases');
var cases_data = [[]];
onValue(cases, (snapshot) => {
    cases_data[0] = snapshot.val();
});


const write = ref(database, 'posts/write');
var write_data = [[]];
onValue(write, (snapshot) => {
  write_data[0] = snapshot.val();
});

const accounts = ref(database, 'posts/users');
var accountData = [[]];
onValue(accounts, (snapshot) => {
  accountData[0] = snapshot.val();
});

var months = {"January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06", 
              "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", 
              "December": "12"
};

function uploadFile () {}

function uploadcaseFile () {}

function uploadAccountFile () {}

uploadcaseFile.prototype.getCsv = function(e) {
    var input = document.getElementById("caseFile");
    var file;
    input.addEventListener('change', function () {
        file = this.files;
    });

    let submitBtn = document.getElementById('uploadcasefile');
    submitBtn.addEventListener('click', function() {
        if (file && file[0]) {
            var myFile = file[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                let csvdata = e.target.result;
                parseCsv1.getParsecsvdata(csvdata);
            });
            reader.readAsBinaryString(myFile);
        }
    });
}

uploadFile.prototype.getCsv = function(e) {
    var input = document.getElementById("uploadedFile");
    var file;
    input.addEventListener('change', function () {
        file = this.files;
    });

    let submitBtn = document.getElementById('uploadfile');
    submitBtn.addEventListener('click', function() {
        if (file && file[0]) {
            var myFile = file[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                let csvdata = e.target.result;
                parseCsv.getParsecsvdata(csvdata);
            });
            reader.readAsBinaryString(myFile);
        }
    });
}

uploadAccountFile.prototype.getCsv = function(e) {
    var input = document.getElementById("accountFile");
    var file;
    input.addEventListener('change', function () {
        file = this.files;
    });

    let submitBtn = document.getElementById('uploadAccountFile');
    submitBtn.addEventListener('click', function() {
        if (file && file[0]) {
            var myFile = file[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                let csvdata = e.target.result;
                parseCsv2.getParsecsvdata(csvdata);
            });
            reader.readAsBinaryString(myFile);
        }
    });
}

uploadFile.prototype.getParsecsvdata = function (data) {
    let parsedData = data.split('\n');
    uploadData(parsedData);
}

uploadcaseFile.prototype.getParsecsvdata = function (data) {
    let parsedData = data.split('\n');
    uploadCases(parsedData);
}

uploadAccountFile.prototype.getParsecsvdata = function (data) {
    let parsedData = data.split('\n');
    uploadAccounts(parsedData);
}

var parseCsv = new uploadFile();
parseCsv.getCsv();

var parseCsv1 = new uploadcaseFile();
parseCsv1.getCsv();

var parseCsv2 = new uploadAccountFile();
parseCsv2.getCsv();



window.uploadCases = function (data) {
    remove(ref(database, 'posts/cases'));
    fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
    .then(res => res.json())
    .then(async readData => {
        for (var i = 0; i < objLength(data); i++){
            await fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts/cases.json/?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"Case": data[i]}) // actual content being written to db from form submission
            });
        }
    });
    alert("Files Uploaded Successfully");

}

// email,password,teamName

window.uploadAccounts = function (data) {
    var accountInfo = data;
    console.log(accountInfo);
    for (var i = 0; i < objLength(accountInfo); i++){
        if (accountInfo[i] != "" && accountInfo[i] != " " && accountInfo[i] != "\r") {
            var parsedAccount = accountInfo[i].split(/,/);
            var username = parsedAccount[0];
            var password = parsedAccount[1];
            var team = parsedAccount[2];
            createUser(username, password, team);
        }
    }
    alert("Files Uploaded Successfully");
}


window.uploadData = function (data) {
    
    var all_matches = data;
    // var all_matches = document.getElementById("uploadfileInfo").value;
    for (var i = 0; i < objLength(all_matches); i++){
        var match_info = all_matches[i].split(/,/);
        var date = match_info[0].split(/ /);
        var database_key = "" + months[date[0]] + date[1];
        if (read_data[0][database_key] != undefined){
            var num_of_matches = objLength(Object.keys(read_data[0][database_key]));
            for (var j = 0; j < num_of_matches; j++){
                var write_database_key = database_key + Object.keys(read_data[0][database_key])[j];
                if (write_data[0][write_database_key] != undefined){
                    removing_day = ref(database, 'posts/write/' + write_database_key);
                    remove(removing_day);
                }
            }
            var removing_day = ref(database, 'posts/read/' + database_key);
            remove(removing_day);
        }
    }

    for (var i = 0; i < objLength(all_matches); i++) {
        var match_info = all_matches[i].split(/,/);
        var date = match_info[0].split(/ /);
        var database_key = "" + months[date[0]] + date[1];
        addMatch(database_key, match_info);
    }
    alert("Files Uploaded Successfully");
}

function addMatch(database_key, match_info){
    var length = 0;
    if (read_data[0][database_key] != undefined){
        length = objLength(Object.keys(read_data[0][database_key]));
    }
    
    if (length < 3) {
        var new_match_num = length + 1;
        if (length > 0){
            var start_hour = match_info[1].split(/:/)[0];
            for (var match in read_data[0][database_key]){
                var match_start_hour = read_data[0][database_key][match]['start'].split(/:/)[0];
                if (Number(start_hour) < Number(match_start_hour)){
                    new_match_num = Number(match);
                    break;
                }
            }

            var matches = Object.keys(read_data[0][database_key]).sort();

            for (var i = objLength(matches) - 1; i >= 0; i--){
                if (Number(matches[i]) >= new_match_num){
                    var saved_match_info = read_data[0][database_key][matches[i]];
                    set(ref(database, 'posts/read/' + database_key + '/' + (Number(matches[i]) + 1)), {
                        start: saved_match_info['start'],
                        end: saved_match_info['end'],
                        moderator: saved_match_info['moderator']
                    });
                    var removing_day = ref(database, 'posts/read/' + database_key + '/' + matches[i]);
                    remove(removing_day);
                }
            }
        }
        set(ref(database, 'posts/read/' + database_key + '/' + new_match_num), {
            start: match_info[1],
            end: match_info[2],
            moderator: match_info[3]
        });
    }
}

function objLength(obj) {
    let count = 0;
  
    for (var elem in obj) {
      count++;
    }
  
    return count;
  }

function createUser(username, password, team) {
    var encoded_username = encodeKey(username);
    fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts.json?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA')
        .then(res => res.json())
        .then(async readData => {
        let parseData = readData["users"]; // point to the user data 

        if (parseData[encodeKey(username)] != null) {
            alert("Another user with the email entered already exists!");
            return;
        }
        /*
        for (let i = 0; i < objLength(parseData); i++){
            let user = parseData[Object.keys(parseData)[i]];
            let value = user[Object.keys(user)[0]];
            if (value["team"] == team){
                alert("Another user with the team entered already exists");
                return;
            }
        }
        */
        
        await fetch('https://oebcalendar-c34e0-default-rtdb.firebaseio.com/posts/users/' + encoded_username + '.json/?AIzaSyBKQ7SbuDkeqsN8d22tAC_a52kpwaKSJVA', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"pass": password, "team": team, "admin": false}) // actual content being written to db from form submission
        });
    });
}

function encodeKey(s) {
    let firstEncode = encodeURIComponent(s).replace(/\./g, '%2E');
    return encodeURIComponent(firstEncode).replace(/\./g, '%2E');
}