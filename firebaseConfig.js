// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC73WvQBbk9q08bs1i-zfmefWmLK-damhE",
  authDomain: "grow-469510.firebaseapp.com",
  projectId: "grow-469510",
  storageBucket: "grow-469510.firebasestorage.app",
  messagingSenderId: "623506187034",
  appId: "1:623506187034:web:f8ee3e1f3bbd03897ac2a3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider };
