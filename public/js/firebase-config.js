// public/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDcolcxTX6Hk1_joy8sAz6iG0iLSvICTdY",
    authDomain: "clinic-management-system-6ae1e.firebaseapp.com",
    projectId: "clinic-management-system-6ae1e",
    storageBucket: "clinic-management-system-6ae1e.firebasestorage.app",
    messagingSenderId: "209140648698",
    appId: "1:209140648698:web:ea837058146e46e8809743"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
