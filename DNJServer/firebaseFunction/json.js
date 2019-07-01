const cron = require('node-cron');
const firebase = require('firebase');
const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('firebase/firestore');
firebase.initializeApp({
  //Keys
});
app = express();

var db = firebase.firestore();
const getAllFirestore = () => {
  let poemsInFirestore = [];
  db.collection('poems')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        poemsInFirestore.push(doc.data());
      });
      console.log(poemsInFirestore);
      // getDataFromApi(poemsInFirestore);
    });
};
const getDataFromApi = poemsInFirestore => {
  console.log('Started');
  axios
    .get('https://disaltydjy-wxzdtqskka.now.sh/api/poems')
    .then(response => {
      console.log('GOT ALL DATA FROM NOW');
      seeIfIncludes(poemsInFirestore, response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
};
seeIfIncludes = (fireStore, now) => {
  now.forEach(now_id => {
    if (!fireStore.includes(now_id._id)) {
      db.collection('poems')
        .add({
          mongo_id: now_id._id,
          name: now_id.name,
          body: now_id.body,
          handle: now_id.handle,
          bookmarkedCount: 0,
          date: parseInt((new Date(now_id.date).getTime() / 1000).toFixed(0)),
          reported: false,
          nsfw: false,
          adminNotes: 'None',
          uid: 'ENZSfsocoZg9BwyTT796FOq2D503'
        })
        .then(function(docRef) {
          db.collection('poems')
            .doc(docRef.id)
            .update({ id: docRef.id })
            .then(() => {
              console.log('Updated');
              // sendEmail(docRef.id);
            });
        })
        .catch(function(error) {
          console.error('Error adding document: ', error);
        });
    }
  });
};

// cron.schedule('0 0 */1 * * *', () => {
//   getAllFirestore();
// });
module.exports.init = getAllFirestore();

// BACKUP FIREBASE
// firebase.initializeApp({
//   apiKey: 'AIzaSyBvirTMZcq_mBH_RLGpy3rbcgSRuZSTeJU',
//   authDomain: 'disnetonsbackup.firebaseapp.com',
//   databaseURL: 'https://disnetonsbackup.firebaseio.com',
//   projectId: 'disnetonsbackup',
//   storageBucket: 'disnetonsbackup.appspot.com',
//   messagingSenderId: '168959021962',
//   appId: '1:168959021962:web:cc04cf1f7bb344a3'
// });
