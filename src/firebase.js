import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB6844ivBHxFu3vC7sJepw7_aIR3-qzuFY',
  authDomain: 'happyb-5c66e.firebaseapp.com',
  projectId: 'happyb-5c66e',
  storageBucket: 'happyb-5c66e.appspot.com',
  messagingSenderId: '74902807457',
  appId: '1:74902807457:web:7a68e6332305f3393b21e0',
  measurementId: 'G-EDBHEP0VB2',
};

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, provider, app, db };
