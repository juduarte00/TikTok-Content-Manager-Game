
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
// get Promise-based interface to sqlite3
const db = require('./sqlWrap');
const win = require("./pickWinner");
const fetch = require("cross-fetch");

/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


// create object to interface with express
const app = express();
// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use(express.text());
// make all the files in 'public' available 

app.use(function(req, res, next) {
  console.log("body contains", req.body);
  next();
});

app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideos.html");
});


app.post("/videoData", async (req, res) => {

  console.log("sending Response");
  // console.log("this is the requested data", req);
  let vidObj = JSON.parse(req.body);
  let tableContents = await dumpTable();
  console.log("this is the object we got", vidObj);

  // Check if we have have 8 or more and send response full
  if (tableContents.length >= 8) {

    return res.send("database full");
  }
  // find flags that have 1 and make them to 0. This changes all flags to 0
  const changeFlags = "UPDATE VideoTable SET flag = FALSE";
  // The bottom line works too ^_^! Just testing what I can do
  // const changeFlags = "UPDATE VideoTable SET flag = FALSE WHERE flag=TRUE";
  await db.run(changeFlags)

  // add item to our list with a true value for the flag
  const addItem = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";
  await db.run(addItem, [vidObj.tiktokurl, vidObj.vidnickname, vidObj.username]);

  // Comments to see everything changing
  tableContents = await dumpTable(); //update this again to see full contents
  console.log(tableContents);
  console.log("this is the new tablecontent length", tableContents.length);

  return res.send('recieved POST');
});

app.get("/getList", async (req, res) => {
  const result = await dumpTable();
  console.log("This is all the items!", result);
  // https://expressjs.com/en/api.html#:~:text=Type%27)%0A//%20%3D%3E%20%22text/plain%22-,res.json,-(%5Bbody%5D)
  return res.json(result);
});

app.get("/getMostRecent", async (req, res) => {
  const getRecentCMD = "SELECT * FROM VideoTable WHERE flag = TRUE";
  const result = await db.get(getRecentCMD);
  console.log("This is the most recent!", result);
  // https://expressjs.com/en/api.html#:~:text=Type%27)%0A//%20%3D%3E%20%22text/plain%22-,res.json,-(%5Bbody%5D)
  return res.json(result);
});

// Give vidID to delete from the database
app.post("/deleteVid", async (req, res) => {
  let videoID = JSON.parse(req.body);
  console.log("This is the videoID given!", videoID);

  // Used to check if we need to update the latest video
  // Debuging info
  // Comments to see everything changing
  let tableContents = await dumpTable(); //update this again to see full contents
  // console.log("how it looks BEFORE DELETING:",tableContents);
  // console.log("TableContent BEFORE DELETING length", tableContents.length);

  try {
    const deleteVidCMD = "DELETE FROM VideoTable WHERE rowIdNum=?";
    await db.run(deleteVidCMD, videoID);
  } catch (err) {
    console.log("error deleting video!", err);
  }
  // Going to set the last id flag to true if possible!
  if (videoID != 1 && tableContents.length == videoID) {
    try {
      const setRecentFlagTrueCMD = "UPDATE VideoTable SET flag=TRUE WHERE rowIdNum=?";
      await db.run(setRecentFlagTrueCMD, videoID - 1);
    } catch (err) {
      console.log("Couldn't change last video flag to True", err);
    }
  }
  // Update ALL the id's so everybody in correct ORDER!
  try {
    const updateGreaterRowID = "UPDATE VideoTable SET rowIdNum= rowIdNum-1 WHERE rowIdNum > ?";
    await db.run(updateGreaterRowID, videoID);
  } catch (err) {
    console.log("Error updating the rows", err);
  }

  // Debugging
  // tableContents = await dumpTable(); //update this again to see full contents
  // console.log("how it looks AFTER DELETING:",tableContents);
  // console.log("TableContent AFTER DELETING length", tableContents.length);

  return res.send("we deleted the vid!");
});

app.get("/testDB",
  function(req, res, next) {
    console.log("we are in testDB!");
    databaseCodeExample();
    next();
  });

app.get("/dumpDB",
  function(req, res, next) {
    console.log("we are dumping DB!");
    db.deleteEverything();
    next();
  });

app.get("/getTwoVideos", async function(req,res) {
    console.log("getting two videos");
    try{
      let result = await dumpTable();
      //console.log("This is the result", result);
      return res.json(result);
    } catch (err) {
      console.log("error grabbing video",err);
    }
});

app.post("/insertPref", async (req, res) => {
    let getObj = JSON.parse(req.body);
    try {
      console.log("These are the preferences given!", getObj);
      const sql = "insert into PrefTable (better, worse) values (?,?)";
      await db.run(sql, [getObj.better, getObj.worse]);
      console.log(await dumpPrefTable());
    } catch (err) {
      console.log("error grabbing preferences",err);
    }

  let tableContents = await dumpPrefTable();
  console.log(tableContents.length);
  if (tableContents.length >= 15) {
    return res.send('pickwinner');
  } else {
    console.log("why not here?");
    return res.send('continue');
  }
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,true);
  console.log(winner);
  const sql = "SELECT * FROM VideoTable WHERE rowIdNum = ?";
  const result = await db.get(sql, winner);
  console.log("this is the data for the winner!", result);
  // you'll need to send back a more meaningful response here.
  return res.json(result);
  } catch(err) {
    res.status(500).send(err);
  }
});

// Need to add response if page not found!
app.use(function(req, res) {
  res.status(404); res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

/****************************/
/* some database operations */
/****************************/


// test the function that inserts into the database
function databaseCodeExample() {

  console.log("testing database");

  // put the video data into an object
  let vidObj = {
    "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
    "nickname": "Cat vs Fish",
    "userid": "ProfAmenta"
  }

  async function insertAndCount(vidObj) {

    await insertVideo(vidObj);
    const tableContents = await dumpTable();
    console.log(tableContents.length);
  }

  insertAndCount(vidObj)
    .catch(function(err) { console.log("DB error!", err) });

  getVideo("Cat vs Fish")
    .then(function(result) {
      // console.log("row contained",result); 
    })
    .catch(function(err) {
      console.log("SQL error", err)
    });

}




// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database
async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";

  await db.run(sql, [v.url, v.nickname, v.userid]);
}

// an async function to get a video's database row by its nickname
async function getVideo(nickname) {

  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select * from VideoTable where nickname = ?';

  let result = await db.get(sql, [nickname]);
  return result;
}

// an async function to get the whole contents of the database 
async function dumpTable() {
  const sql = "select * from VideoTable"

  let result = await db.all(sql)
  return result;
}

async function dumpPrefTable() {
  const sql = "select * from PrefTable"

  let result = await db.all(sql)
  return result;
}