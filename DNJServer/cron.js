const cron = require('node-cron');
const express = require('express');
const firebase = require('firebase');
const moment = require('moment');
require('firebase/firestore');
//
firebase.initializeApp({
  //KEYS
});

app = express();
const db = firebase.firestore();

getAllFirestore = async () => {
  const allPoems = db.collection('poems');
  const dateNow = Date.now();
  const unixTimestamp = moment(dateNow).unix();
  const sevenUnixDays = 24 * 60 * 60 * 7;
  const sevenDaysAgo = unixTimestamp - sevenUnixDays;
  console.log(sevenDaysAgo);
  let lastSevenDaysPoems = [];
  await allPoems
    .where('date', '>', sevenDaysAgo)
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        lastSevenDaysPoems.push(doc.data());
      });
    })
    .then(() => {
      getAllUsersToNotify(lastSevenDaysPoems);
      console.log(lastSevenDaysPoems.length);
    });
};
getAllUsersToNotify = async lastSevenDaysPoems => {
  console.log(lastSevenDaysPoems.length);
  const numberOfPoems = lastSevenDaysPoems.length;
  let allTokens = [];
  await db
    .collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.data().token) {
          fetch('http://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: doc.data().token,
              sound: 'default',
              title: 'DNJ 🖊️',
              body: `${numberOfPoems} new poems this week 🔥 - Click to have a look 👀`
            })
          })
            .then(res => console.log(`${doc.data().token} Sent`))
            .catch(err => console.log(`${doc.data().token} Error`));
        }
      });
    })
    .then(res => {
      console.log('Done');
      // fetch('https://exp.host/--/api/v2/push/send', {
      //   method: 'POST',
      //   headers: {
      //     host: 'exp.host',
      //     accept: 'application/json',
      //     'accept-encoding': 'gzip, deflate',
      //     'content-type': 'application/json'
      //   },
      //   body: JSON.stringify(allTokens)
      // })
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err));
    });
};

module.exports.init = getAllFirestore();
