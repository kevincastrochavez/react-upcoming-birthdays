import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB6844ivBHxFu3vC7sJepw7_aIR3-qzuFY',
  authDomain: 'happyb-5c66e.firebaseapp.com',
  projectId: 'happyb-5c66e',
  storageBucket: 'happyb-5c66e.appspot.com',
  messagingSenderId: '74902807457',
  appId: '1:74902807457:web:7a68e6332305f3393b21e0',
  measurementId: 'G-EDBHEP0VB2',
};

const app = initializeApp(firebaseConfig);

export { app };
