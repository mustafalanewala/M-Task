import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCIi8pLEBoNJNzHTAlyHkgbaZRfkbyTtgE",
  authDomain: "mtask-2024.firebaseapp.com",
  databaseURL: "https://mtask-2024-default-rtdb.firebaseio.com",
  projectId: "mtask-2024",
  storageBucket: "mtask-2024.appspot.com",
  messagingSenderId: "753647947337",
  appId: "1:753647947337:web:faf2b237c63e9ce37b7998",
  measurementId: "G-8DPV537TLD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };