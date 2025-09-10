// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO-WimrgBnh2mmp6_ooQXkIJN5nCOVVVk",
  authDomain: "muhamadproject-9e569.firebaseapp.com",
  projectId: "muhamadproject-9e569",
  storageBucket: "muhamadproject-9e569.firebasestorage.app",
  messagingSenderId: "619426021703",
  appId: "1:619426021703:web:c45cb0271f8bec1685cc62",
  measurementId: "G-FLZRH8QVZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);