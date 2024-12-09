import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6bXQwvNtxG9nTOlxA-1WoJUFdPnQV01I",
  authDomain: "portaldoanalista-ats-fcac6.firebaseapp.com",
  projectId: "portaldoanalista-ats-fcac6",
  storageBucket: "portaldoanalista-ats-fcac6.firebasestorage.app",
  messagingSenderId: "747725654908",
  appId: "1:747725654908:web:7c860cd7ecdad1bb1672f9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);