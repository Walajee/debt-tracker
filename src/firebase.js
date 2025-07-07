// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq1Lt4_UbnqHz4GE1zMC6W8v_zQdJy3OU",
  authDomain: "debt-tracker-91131.firebaseapp.com",
  projectId: "debt-tracker-91131",
  storageBucket: "debt-tracker-91131.firebasestorage.app",
  messagingSenderId: "592742378789",
  appId: "1:592742378789:web:95ae05909f75f7d4017ecc",
  measurementId: "G-G19QV1VYS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);