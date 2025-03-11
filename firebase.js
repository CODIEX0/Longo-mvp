import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDJyckPM56ZJtAHJFR3N1Q3WFijf0z4cog",
  authDomain: "longo-36e06.firebaseapp.com",
  databaseURL: "https://longo-36e06-default-rtdb.firebaseio.com",
  projectId: "longo-36e06",
  storageBucket: "longo-36e06.firebasestorage.app",
  messagingSenderId: "619076480670",
  appId: "1:619076480670:web:c392010b29fec44c97158f",
  measurementId: "G-RE3CW6YDN0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Realtime Database
const db = firebase.database();

export { firebase, db }; 