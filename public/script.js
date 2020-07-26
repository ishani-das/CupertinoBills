// client-side js, loaded by index.html
// run by the browser each time the page is loaded

//lets user interact with the site
$(window).resize(function () { 
   $('body').css('padding-top', parseInt($('#main-navbar').css("height")));
});

// change the table with the id "bills" in index.html
const billList = document.getElementById("bills");
var comments = {};

var modal = document.getElementById("commentsModal");

var insertModal = document.getElementById("insertComments");

$('#commentsModal').css("margin-top", $(window).height() / 2 - $('.modal-content').height() / 2);
$('#insertComments').css("margin-top", $(window).height() / 2 - $('.modal-content').height() / 2);

var cmtsrc = "https://www.pngkey.com/png/full/834-8341892_bubble-comment-chat-message-add-compose-comments-telephone.png";

// show comments  
function showcomments(bill_id) {
  var ul = document.getElementById("commentsDiv");  
   while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
   }
  for (var i in comments[bill_id]) {   
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(comments[bill_id][i]['comment_text']));
    ul.appendChild(li);
  }
  //modal.style.display = "block";
  $('#commentsModal').modal('show');

}

function updatecommentlength(bill_id) {
  var spanid = document.getElementById(bill_id);
  spanid.innerHTML = comments[bill_id].length;
}

// function to make a new comment 
function newcomment() {  
  var jbody = JSON.stringify({
        bill_id: document.getElementById("bill_id").value,
        comment_text: document.getElementById("comment_text").value
        });
  fetch("/comments", {
    method:"POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jbody
    })
  // actully do smth with the data 
  .then(response => response.json())
  .then(data => {
        // do something with the result
        console.log("Completed with result:", data);
      //insertModal.style.display = "none";
      $('#insertComments').modal('hide');
      var bill_id = data[0]["bill_id"];
      comments[bill_id] = data;
      updatecommentlength(bill_id);
    });
}

function acceptcomment(bill_id) {
  document.getElementById("bill_id").value = bill_id;
  //insertModal.style.display = "block";
  $('#insertComments').modal('show');

}

// How the bill with comments is displayed 
function appendNewBill(bill) {
  var row = billList.insertRow(-1);
  // window.alert(bill.bill_id);
  var cell=row.insertCell(0);
  cell.innerHTML = "<h2 style='display:inline'>" + bill.topic + "</h2>  " + 
    "" + bill.bill_content  + "" +
    "<a href=\"javascript:showcomments('" + 
    bill.bill_id + "')\">" + 
    "<span id="+ "'" + bill.bill_id +  "'" + ">" +
    "" + bill.comments.length + " " + 
     "</span>" +
    " comments   </a>" +
    "<img src=" + cmtsrc + " + style=\"width:15px;height:15px;\" onclick=\"javascript:acceptcomment(" +
     "'"+ bill.bill_id +"'" +")\"></img>" + "<br><br><br>";
  comments[bill.bill_id] = bill.comments;
  
}

// Fetch the bills
fetch("/bills")
  .then(response => response.json()) // parse the JSON from the server
  .then(billData => {
    billData.forEach(appendNewBill);
})
