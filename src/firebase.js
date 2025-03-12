// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJyckPM56ZJtAHJFR3N1Q3WFijf0z4cog",
  authDomain: "longo-36e06.firebaseapp.com",
  projectId: "longo-36e06",
  storageBucket: "longo-36e06.firebasestorage.app",
  messagingSenderId: "619076480670",
  appId: "1:619076480670:web:c392010b29fec44c97158f",
  measurementId: "G-RE3CW6YDN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 

