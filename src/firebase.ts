import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVKh7ZrUeSPEx5DbIQoPeJM_uiXFIQUQI",
  authDomain: "sidequest-c0905.firebaseapp.com",
  projectId: "sidequest-c0905",
  storageBucket: "sidequest-c0905.firebasestorage.app",
  messagingSenderId: "793003989763",
  appId: "1:793003989763:web:be545cb02a8b6c88cea736",
  measurementId: "G-SLSMZFEV7D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();