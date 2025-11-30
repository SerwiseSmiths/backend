// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import * as firebaseAdmin from "firebase-admin" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY!,
  authDomain: process.env.FIREBASE_AUTHDOMAIN!,
  projectId: process.env.FIREBASE_PROJECTID!,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID!,
  appId: process.env.FIREBASE_APPID!,
  measurementId: process.env.FIREBASE_MESUREMENTID!
};


// Initialize Firebase
firebaseAdmin.initializeApp(firebaseConfig);


export default firebaseAdmin;

