importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');


const firebaseConfig = {
  apiKey: "AIzaSyDAWwxAAwu6HH2uPyig2b7i6_CXk7E4ZQw",
  authDomain: "broker-crm-44ab3.firebaseapp.com",
  projectId: "broker-crm-44ab3",
  storageBucket: "broker-crm-44ab3.appspot.com",
  messagingSenderId: "1035112336953",
  appId: "1:1035112336953:web:8eecf79ef91d9bfcbc47e8",
  measurementId: "G-0J414GVMTX"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "../src/assets/image/default.svg",
    tag: "notification-1"
  };
  
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});