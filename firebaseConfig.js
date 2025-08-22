// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD_kiYRu7LtfQyCAPQmJ0hyv-EdI3YwAkc',
  authDomain: 'growupe-83565.firebaseapp.com',
  projectId: 'growupe-83565',
  storageBucket: 'growupe-83565.firebasestorage.app',
  messagingSenderId: '612098820148',
  appId: '1:612098820148:android:0dd962ab8da084499c6261',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider };
