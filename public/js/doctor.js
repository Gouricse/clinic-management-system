import { auth, db } from './firebase-config.js';
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  collection, getDocs, updateDoc,
  doc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const patientList = document.getElementById("patientList");
const logoutBtn = document.getElementById("logoutBtn");

async function loadPatients() {
  try {
    const q = query(collection(db, "patients"), orderBy("token", "asc"));
    const snapshot = await getDocs(q);
    patientList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const patient = docSnap.data();
      const id = docSnap.id;
      const card = document.createElement("div");
      card.className = "patient-card";
      card.innerHTML = `
        <p><strong>Token:</strong> ${patient.token}</p>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Status:</strong> ${patient.status}</p>
        <textarea id="prescription-${id}" placeholder="Enter prescription">${patient.prescription}</textarea>
        <button onclick="savePrescription('${id}')"><i class="fas fa-notes-medical"></i> Save</button>
        <hr/>
      `;
      patientList.appendChild(card);
    });
  } catch (err) {
    patientList.innerHTML = "Failed to load patients.";
  }
}

window.savePrescription = async (id) => {
  const prescription = document.getElementById(`prescription-${id}`).value;
  try {
    const patientRef = doc(db, "patients", id);
    await updateDoc(patientRef, {
      prescription,
      status: "checked"
    });
    alert("Prescription saved!");
    loadPatients();
  } catch (error) {
    alert("Failed to save prescription.");
  }
};

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

onAuthStateChanged(auth, (user) => {
  if (user) loadPatients();
  else window.location.href = "index.html";
});
