// this file is where we access the database and set up the functions 
// for reading and writing data 

// Access the database using a link containing a user and password
const MongoClient = require("mongodb").MongoClient;
const dbuser=process.env.DBUSER; // just to make sure it's private 
const dbpass=process.env.DBPASS;
const uri =
  "mongodb+srv://" + dbuser + ":" + dbpass + "@cluster0.qlfrn.mongodb.net/bill_db?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// A helper function to simplify getBillsWithComments
function getComments(dbo, in_bill_id, ind, callback) {
  var retdata = {};
//  MongoClient.connect(uri, function(err, db) {
//    if (err) throw err;
//    var dbo = db.db("bill_db");
    const cursor = dbo
      .collection("comments")
      .find({ bill_id: in_bill_id })
      .toArray()
      .then(data => {
        callback(data, ind);
      })
//  });
}


// Adds new comments to the database
function insertComment(cmt, callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) { console.log(err); return callback()};
    var dbo = db.db("bill_db");

    dbo.collection("comments").insertOne(cmt, function(err, res) {
    if (err) { console.log(err); return callback()};
      console.log("1 comment inserted for " + cmt.bill_id);
      db.close();
      getComments(dbo, cmt.bill_id, -1, function(data, ind) {
        callback(data);
      });
    });
  });
}
  

// Retreives bills/comment information in an array from the MongoDB when called
function getBillsWithComments(callback) {
  var retdata = {};
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("bill_db");
    const cursor = dbo
      .collection("bills")
      .find()
      .toArray()
      .then(data => {
        var processed = [];
        console.log(data.length);
        for (var i in data) {
          console.log('processing ' + data[i].bill_id + " ,i="+ i);
          getComments(dbo, data[i].bill_id, i, function(cmtData, i) {
            console.log('comments for ' + data[i].bill_id + ':' + cmtData.length);
            data[i]["comments"] = cmtData;
            processed.push(data[i]);
            console.log(processed.length);
            if (processed.length >= data.length) {
              //done
              callback(data);
            }
          })
        }
      })
      .then(() => {
        db.close();
      });
  });
}


// NEED TO WRITE 
module.exports = {
  getBillsWithComments,
  insertComment
};
