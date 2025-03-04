// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Configuration Firebase ZenLife
const firebaseConfig = {
  apiKey: "AIzaSyBPjNVRFMW8UIQD_fcEzObyQorRPbH3EzI",
  authDomain: "zenlife-b7b30.firebaseapp.com",
  projectId: "zenlife-b7b30",
  storageBucket: "zenlife-b7b30.firebasestorage.app",
  messagingSenderId: "369768393311",
  appId: "1:369768393311:web:b11e09b4541edf5ed709ea",
  measurementId: "G-VB9HXW4RRR"
};

// Initialiser l'application Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { firebaseApp, messaging };
