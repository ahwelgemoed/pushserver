// server.js
var express = require('express');
const firebase = require('firebase');
require('firebase/firestore');
firebase.initializeApp({
  //Keys
});

var db = firebase.firestore();
var app = express(db);
var port = 8080;
var allTokens = [];
getTokens();
app.listen(port, function() {
  console.log('app started');
});

app.get('/', function(req, res) {
  // res.send(console.log(allTokens.token));
});

async function getTokens(params) {
  db.collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        allTokens.push({
          to: 'ExponentPushToken[71DlKBEp4ybxdYI1akJE-M]',
          sound: 'default',
          body: 'Welcome To DNJ'
        });
      });
    })
    .then(res => {
      console.log(allTokens);
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allTokens)
      });
    })
    .catch(reason => {
      console.log(reason);
    });
}
