// Initialize Firebase
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCkS1YfODcPjP3IOh-v0Xmyzq6OddGxykI",
  authDomain: "facequiz-8e041.firebaseapp.com",
  databaseURL: "https://facequiz-8e041.firebaseio.com",
  projectId: "facequiz-8e041",
  storageBucket: "",
  messagingSenderId: "608142491210"
};

console.log("firebase.js executed");

firebase.initializeApp(config);
export default firebase;