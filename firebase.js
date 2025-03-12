import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbizOTP_4n2_HD-UKTV370sqJXogZMeGc",
  authDomain: "longo-79a99.firebaseapp.com",
  databaseURL: "https://longo-79a99-default-rtdb.firebaseio.com",
  projectId: "longo-79a99",
  storageBucket: "longo-79a99.firebasestorage.app",
  messagingSenderId: "266656742456",
  appId: "1:266656742456:web:a3fa826f7e54002d447acd",
  measurementId: "G-7NRSNVEN34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const analytics = getAnalytics(app);
// Initialize Realtime Database
const db = firebase.database();

export { firebase, db }; 