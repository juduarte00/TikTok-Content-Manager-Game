let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

let videobutton = document.getElementById("myvideos");
videobutton.addEventListener("click",buttonClick);


function buttonClick() {
  window.location = "myVideos.html";
}

// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: JSON.stringify(data) };
  console.log("about to send post request");

  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}
/*
// This function needs work! Not too sure if it is doing what its supposed to do
async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'text/plain'}
  };
  console.log("about to send recieve request!");

  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    console.long("check this out: ", data)
    return data;
  } else {
    throw Error(response.status);
  }
};
*/

function buttonPress() { 
    // Get all the user info.
  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;

  // let data = username+","+URL+","+nickname;

  let data = {
    username: username,
    tiktokurl: URL,
    vidnickname: nickname
  };
  console.log("This is our data", data);
  
  sendPostRequest("/videoData", data)
  .then( function (response) {
    console.log("Response recieved", response);
    if(response == "database full") {
      alert("database full");
    } else {
      //sessionStorage.setItem("nickname", nickname);
      window.location = "videoViewer.html";
    }
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
