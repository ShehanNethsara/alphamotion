import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: මේ පහත තියෙන කොටස ඔයාගේ Firebase Project Settings වලින් අරගෙන පුරවන්න
const firebaseConfig = {
  apiKey: "AIzaSyAZEISQC20TT5YEQkBMTmcbVV6qqtpEcOk",
  authDomain: "alpha-motion-5f0b0.firebaseapp.com",
  projectId: "alpha-motion-5f0b0",
  storageBucket: "alpha-motion-5f0b0.firebasestorage.app",
  messagingSenderId: "1075532231715",
  appId: "1:1075532231715:web:2ff06c7838798216d36d96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication සහ Database සේවාවන් එළියට යැවීම (Export)
export const auth = getAuth(app);
export const db = getFirestore(app);