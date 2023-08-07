let addnewbutton = document.getElementById("addnew");
addnewbutton.addEventListener("click",addButtonPress);

let playbutton = document.getElementById("playgame");
playbutton.addEventListener("click",playButtonPress);

async function addButtonPress () {
  let getObj = await sendGetRequest2("/getList");
  console.log("this is get Obj!", await getObj);
  const num = getObj.length;
  if (num < 8){
    window.location = "tiktokpets.html";
  } 
}

async function playButtonPress () {
  let getObj = await sendGetRequest2("/getList");
  console.log("this is get Obj!", await getObj);
  const num = getObj.length;
  if (num == 8){
    window.location = "compare.html";
  } 
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

async function sendGetRequest2(url) {
  params = {
    method: 'GET',
    headers: { 'Content-Type': 'text/plain' }
  };
  console.log("about to send GET request!");

  let response = await fetch(url, params);
  console.log("this is the response for get", response);

  if (response.ok) {
    let data = await response.text();
    return JSON.parse(data);
  } else {
    throw Error(response.status);
  }
}
async function getVideos() {
  let getObj = await sendGetRequest2("/getList");
  console.log("this is get Obj!", await getObj);
  const num = getObj.length;
  console.log("number of items in data",num);
  // Clear everything
  for (let i = 1; i < 9; i++) {
    let text1 = "vid";
    let id = String(i);
    let result = text1.concat(id);
    console.log(result);
    document.getElementById(result).innerHTML =  
      `
      `;
    document.getElementById(result).style.border = "3px dashed lightgray";
  }
  // Propagating the videos on screen
  for (let i = 1; i < num + 1; i++) {
    let text1 = "vid";
    let id = String(i);
    let result = text1.concat(id);
    console.log(result);
    document.getElementById(result).innerHTML =  
      `
      ${getObj[i-1]["nickname"]}
      `;
    document.getElementById(result).style.border = "solid lightgray";
  }
  // lets deal with the button colors
  if (num < 8){
    document.getElementById("playgame").style.background = "rgba(238, 29, 82, 0.5)";
    document.getElementById("addnew").style.background = "rgba(238, 29, 82, 0.9)";
  } else {
    document.getElementById("addnew").style.background = "rgba(238, 29, 82, 0.5)";
    document.getElementById("playgame").style.background = "rgba(238, 29, 82, 0.9)";
  }
  
}

function getNickname(item) {
  return [item.nickname]
}

async function eraseText(id) {
    console.log("erasing text of id", id);
    // https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript
    let idNumber = id.match(/(\d+)/)[0];
    console.log("this is the extracted number", idNumber);
  
    let resp = await sendPostRequest("/deleteVid",idNumber);
    console.log("this is what I got for eraseText", resp);
    // document.getElementById(id).innerHTML =  
    //   `
    //   ${""}
    //   `;
    document.getElementById(id).style.border = "3px dashed lightgray";
    // Then we reload all the elements
    getVideos();
}

getVideos();
