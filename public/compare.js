
let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

let next_button = document.getElementById("enabledButton");
next_button.addEventListener("click", nextButtonClick);


//temporary 
let defid = 10;
let id1 = 10;
let id2 = 10;


async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: JSON.stringify(data) };
  console.log("about to send post request", );
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
// "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];

  async function loadTwoVideos() {
      let tableContents = await sendGetRequest("/getTwoVideos");
      const videoID1 = getRandomInt(8);
      let video1 = tableContents[videoID1];
      console.log(video1);
      let getURL1 = await video1.url;
      await addVideo(getURL1,videoElmts[0]);
      id1 = video1.rowIdNum;
    
      tableContents.splice(videoID1, 1);
      const videoID2 = getRandomInt(7);
      let video2 = tableContents[videoID2];
      console.log(video2);
      let getURL2 = await video2.url;
      await addVideo(getURL2,videoElmts[1]);
      id2 = video2.rowIdNum;

    // for (let i=0; i<2; i++) {
    //     console.log("getting videos in compare.js");
    //     let getObj = await sendGetRequest("/getTwoVideos");
    //     let getURL = await getObj.url;
    //     console.log("this is url in initVideo", getURL);
    //     await addVideo(getURL,videoElmts[i]);
    //     if (i == 0) {
    //       id1 = getObj.rowIdNum;
    //     } else {
    //       id2 = getObj.rowIdNum;
    //     }
    //     //addVideo(getObj[i]["url"],videoElmts[i]);
    //   }
  };

    loadTwoVideos();
    // load the videos after the names are pasted in! 
    loadTheVideos();
  
//heartButtons.addEventListener("click",heartClick);


// function sendPost(preference){
//       console.log("preference in send post", preference);
//       let data = JSON.stringify(preference);
//       sendPostRequest("/insertPref", data)
//       .then ( function (response) {
//         console.log("Response recieved", response);
//       })
//       .catch( function(err) {
//         console.log("POST request error",err);
//       });
// }

async function getPreference (id) {
  let defid = id; 
  let button = document.getElementById(id);
  button.innerHTML = "<i class='fa fa-heart'></i>";
  button.style.color = "rgba(238, 29, 82, 0.9)";
}

async function nextButtonClick() {
  if (defid == 1){
      let preference = {
          better: id1,
          worse: id2
      };
    console.log("preference is: ", preference);
    sendPostRequest("/insertPref" , preference)
    .then ( function (response) {
        console.log("Response recieved", response);
        if (response == "continue") {
          window.location = "compare.html";
        } else {
          window.location = "winner.html";
        }
    })
    .catch( function(err) {
        console.log("POST request error",err);
    });
  } else {
      let preference = {
        better: id2,
        worse: id1
      };
    console.log("preference is: ", preference);
    sendPostRequest("/insertPref" , preference)
    .then ( function (response) {
        console.log("Response recieved", response);
        if (response == "continue") {
          window.location = "compare.html";
        } else {
          window.location = "winner.html";
        }
    })
    .catch( function(err) {
        console.log("POST request error",err);
    });
  }
}

    