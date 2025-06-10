// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2JySmmOh3oDE0Rq4jjIg2xiiEqVjY2e8",
  authDomain: "appambia.firebaseapp.com",
  projectId: "appambia",
  storageBucket: "appambia.firebasestorage.app",
  messagingSenderId: "1042774152717",
  appId: "1:1042774152717:web:8410ad62ea432f0ee26744",
  measurementId: "G-7PN6C3HMZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);