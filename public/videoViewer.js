let button = document.getElementById("continue");
button.addEventListener("click",() => window.location = "myVideos.html");

let reloadButton = document.getElementById("reload");
// set up button
reloadButton.addEventListener("click",reloadVideo);

// This function needs work! Not too sure if it is doing what its supposed to do
async function sendGetRequest2(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'text/plain'}
  };
  console.log("about to send GET request!");

  let response = await fetch(url,params);
  console.log("this is the response for get", response);
  
  if (response.ok) {
    let data = await response.text();
    return JSON.parse(data);
  } else {
    throw Error("Error with get Request",response.status);
  }
};

// element that we will use 
let divElmt = document.getElementById("tiktokDiv");

// partially got this from https://www.youtube.com/watch?v=FN_ffvw_ksE&ab_channel=CodeBushi

// async function sendGetRequest() {
//   params = {
//     method: 'GET',
//     headers: { 'Content-Type': 'text/plain' }
//   };
//   console.log("about to send recieve request!");

//   //using the getMostRecent url... not sure if this is right lol but it works!
//   await fetch("https://tiktoksofpets4petspart2.ecs162-s22.repl.co/getMostRecent")
//     .then(response => {
//       if (!response.ok) {
//         throw Error("ERROR");
//       }
//       console.log(response);
//       return response.json();
//     })
//     .then(data => {
//       let url = data.url;
//       // checking that it works
//       console.log(url);
//       // use this for nickname label
//       let nickname = data.nickname;
//       // add the blockquote element that TikTok wants to load the video into
//       addVideo(url, divElmt);
//       return data;
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }


// // call the function
// sendGetRequest();

// // on start-up, load the videos
// loadTheVideos();

async function initVideo() {
  let getObj = await sendGetRequest2("/getMostRecent");
  console.log("this is get Obj!", getObj);
  let getURL = await getObj.url;
  console.log("this is url in initVideo", getURL);
  await addVideo(getURL, divElmt);
  loadTheVideos();
console.log("After Loading the video!");
  // Now going to put the name in the screen!
  document.getElementById("uploaded").innerHTML = 
            `<h2>
            <span>${getObj.nickname}</span> 
            </h2>`;
};

initVideo();

// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl, divElmt) {

  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id", videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);

  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}


// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
async function reloadVideo () {
  let getObj = await sendGetRequest2("/getMostRecent");
  let getURL = await getObj.url;
  // get the two blockquotes
  let blockquotes 
 = document.getElementsByClassName("tiktok-embed");
  console.log("all blockquotes", blockquotes);
  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(getURL,divElmt);
  loadTheVideos();
}