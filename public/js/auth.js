import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginForm = document.getElementById('loginForm');
const errorDisplay = document.getElementById('error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const role = loginForm.role.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.role === role) {
        window.location.href = role === 'doctor' ? 'doctor-dashboard.html' : 'receptionist-dashboard.html';
      } else {
        errorDisplay.textContent = 'Incorrect role selected.';
      }
    } else {
      errorDisplay.textContent = 'User role not found.';
    }
  } catch (err) {
    errorDisplay.textContent = err.message;
  }
});
