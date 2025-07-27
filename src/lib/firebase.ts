import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyADcajt0qYSIqaucYX22ZA0o_yjXb3wGrM",
  authDomain: "chat-22a6e.firebaseapp.com",
  projectId: "chat-22a6e",
  storageBucket: "chat-22a6e.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };