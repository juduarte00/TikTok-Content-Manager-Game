// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElement = document.getElementById("tiktokDiv");

let theReloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
theReloadButton.addEventListener("click",function () {
  window.location = "winner.html";
});

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
     };
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}

// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

async function showWinningVideo() {
  let result = await sendGetRequest("/getWinner");
  console.log("this is the winning object", result);
  let getURL = await result.url;
  console.log("this is the winning url", getURL);
  addVideo(getURL, divElement);
  loadTheVideos();
}
