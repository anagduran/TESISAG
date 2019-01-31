  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBWn3zjLOY22bfJzBTl-cNmuWqltGFIWcg",
    authDomain: "tigana-abf11.firebaseapp.com",
    databaseURL: "https://tigana-abf11.firebaseio.com",
    projectId: "tigana-abf11",
    storageBucket: "tigana-abf11.appspot.com",
    messagingSenderId: "1064112844804"
  };

  navigator.serviceWorker.register('/js/firebase-messaging-sw.js', {scope:"firebase-cloud-messaging-push-scope"})
.then((registration) => {
        firebase.initializeApp(config);
        const messaging = firebase.messaging();
        messaging.useServiceWorker(registration);
            messaging.requestPermission().then(function() {
              //getToken(messaging);
              return messaging.getToken();
          }).then(function(token){
          console.log(token);
          })
          .catch(function(err) {
          console.log('Permission denied', err);
          });


          messaging.onMessage(function(payload){
          console.log('onMessage: ',payload);
          });
});
  
  