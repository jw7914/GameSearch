// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChAEDbG7X1OXofLN_Vap_dxuT9CiRQahQ",
  authDomain: "gamesearch-f1baa.firebaseapp.com",
  projectId: "gamesearch-f1baa",
  storageBucket: "gamesearch-f1baa.firebasestorage.app",
  messagingSenderId: "500788516077",
  appId: "1:500788516077:web:b4f118860917d98de4e8e4",
  measurementId: "G-G8KF64BGEX",
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

// Initialize authentication
const auth = getAuth(firebaseapp);

// If you're using analytics, initialize it like this:
// const analytics = getAnalytics(firebaseapp);

// Export as named exports
export { firebaseapp, auth };
