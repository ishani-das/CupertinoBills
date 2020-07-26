// server.js
// The javacript that runs when you load the webpage

// we've started off with Express
const express = require("express");
const app = express();
const db = require("./db.js");
var bodyParser = require('body-parser');

app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Set newindex.html as starting page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/newindex.html");
});

//handle requests 
app.get("/bills", (request, response) => {
  var bill_text = "";

  db.getBillsWithComments(function(data) {
    console.log("got bills from db:" + data.length);
    response.json(data);
  });
});

app.post('/comments', (req, res) => {
    var cmt = {};
  console.log(req.body);
    cmt["bill_id"] = req.body.bill_id,
    cmt["comment_text"] = req.body.comment_text;
     console.log(cmt);
    db.insertComment(cmt, function(data) {
        if (!data) {
          console.log("error inserting data");
          res.json({});
        }
      res.json(data);
    })

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
