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
  // iOS app ID - add this if you have it
  // iosAppId: '1:612098820148:ios:YOUR_IOS_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider with proper scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('openid');
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { auth, googleProvider as GoogleAuthProvider };
