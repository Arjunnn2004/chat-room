import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADcajt0qYSIqaucYX22ZA0o_yjXb3wGrM",
  authDomain: "chat-22a6e.firebaseapp.com",
  projectId: "chat-22a6e",
  storageBucket: "chat-22a6e.appspot.com",
  messagingSenderId: "688350540633",
  appId: "1:688350540633:web:0dfd0ce209f8557e225248",
  measurementId: "G-V519W7CBZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };