// firebase.js
// Garz Manager Firebase setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ============================================
// YOUR FIREBASE CONFIG
// ============================================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmT0p-t5aGZKsd2kqi7iP46C1fsEiU6xI",
  authDomain: "garz-dashboard.firebaseapp.com",
  projectId: "garz-dashboard",
  storageBucket: "garz-dashboard.firebasestorage.app",
  messagingSenderId: "832733585201",
  appId: "1:832733585201:web:823543aedb266343699a10",
  measurementId: "G-0J1SMSNXT7"
};

// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const firestore = getFirestore(app);

export {
    app,
    auth,
    firestore
};
