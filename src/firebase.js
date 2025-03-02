// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Twoje dane konfiguracyjne
  apiKey: "AIzaSyA8_-IsyMqlG9D9qhtdV-Afh04MyClSO7o",
  authDomain: "wypalenie-zawodowe.firebaseapp.com",
  projectId: "wypalenie-zawodowe",
  storageBucket: "wypalenie-zawodowe.appspot.com",
  messagingSenderId: "216418511131",
  appId: "1:216418511131:web:13ddaf971bb0e5c1370bbe",
  measurementId: "G-2CT5V8WXD4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <-- to jest nasz Firestore

export { auth, db };
export default app;
