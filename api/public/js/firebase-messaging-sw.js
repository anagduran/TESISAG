 importScripts("firebase-app.js");
 importScripts("firebase-messaging.js");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBWn3zjLOY22bfJzBTl-cNmuWqltGFIWcg",
    authDomain: "tigana-abf11.firebaseapp.com",
    databaseURL: "https://tigana-abf11.firebaseio.com",
    projectId: "tigana-abf11",
    storageBucket: "tigana-abf11.appspot.com",
    messagingSenderId: "1064112844804"
  };

  firebase.initializeApp(config);
  const messaging = firebase.messaging();
