import firebase from "firebase";
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAw5uIZdlyPYjBuYoc8zRjbiv0-lxWANys",
  authDomain: "playground-3f11f.firebaseapp.com",
  databaseURL: "https://playground-3f11f.firebaseio.com",
  projectId: "playground-3f11f",
  storageBucket: "playground-3f11f.appspot.com",
  messagingSenderId: "1016399993027"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const settings = {
  timestampsInSnapshots: true
};

firestore.settings(settings);

export default firebase;
