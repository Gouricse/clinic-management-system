import { auth, db } from './firebase-config.js';
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, query, getDoc,
  orderBy, serverTimestamp, doc,
  updateDoc, where, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Form Elements
const form = document.getElementById("patientForm");
const logoutBtn = document.getElementById("logoutBtn");
const billList = document.getElementById("billList");

// Add New Patient
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const contact = form.contact.value;
  const treatment = form.treatment.value;

  try {
    const tokenQuery = query(collection(db, "patients"), orderBy("token", "desc"), limit(1));
    const tokenSnap = await getDocs(tokenQuery);
    let token = 1;
    if (!tokenSnap.empty) {
      token = tokenSnap.docs[0].data().token + 1;
    }

    const patientData = {
      name,
      age,
      gender,
      contact,
      treatment,
      token,
      createdAt: serverTimestamp(),
      prescription: "",
      status: "waiting"
    };

    await addDoc(collection(db, "patients"), patientData);
    alert("Patient added!");
    form.reset();
    loadBillablePatients();
  } catch (error) {
    console.error("Error adding patient:", error);
    alert("Failed to add patient.");
  }
});

// Load Checked Patients for Billing
async function loadBillablePatients() {
  try {
    const q = query(collection(db, "patients"), where("status", "in", ["checked", "billed"]));
    const snapshot = await getDocs(q);
    console.log("Billing Patients Found:", snapshot.size);

    billList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const patient = docSnap.data();
      const id = docSnap.id;

      let amount = 300;
      if (patient.treatment === "Dental") amount = 500;
      else if (patient.treatment === "ENT") amount = 400;
      else if (patient.treatment === "Dermatology") amount = 450;

      const isBilled = patient.bill && patient.bill.amount;

      const div = document.createElement("div");
      div.className = "patient-card";

      div.innerHTML = `
        <p><strong>Token:</strong> ${patient.token}</p>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Treatment:</strong> ${patient.treatment}</p>
        <p><strong>Status:</strong> ${patient.status}</p>
        <p><strong>Prescription:</strong> ${patient.prescription || 'None'}</p>
        <p><strong>Bill:</strong> ${isBilled ? '₹' + patient.bill.amount : 'Not Generated'}</p>
        <button onclick="generateBill('${id}', '${patient.treatment}')">
  <i class="fas fa-file-invoice-dollar"></i> Generate Bill
</button>
<button onclick="generatePDF('${id}')">
<i class="fas fa-print"></i> Print Bill
</button>
        <hr/>
      `;
      billList.appendChild(div);
    });

    if (snapshot.empty) {
      billList.innerHTML = `<p style="color:gray;">No patients ready for billing.</p>`;
    }
  } catch (err) {
    console.error("Error loading billable patients:", err);
    billList.innerHTML = `<p style="color:red;">Error loading billing information.</p>`;
  }
}


// Generate Bill
window.generateBill = async (id, treatment) => {
  try {
    let amount = 300;
    if (treatment === "Dental") amount = 500;
    else if (treatment === "ENT") amount = 400;
    else if (treatment === "Dermatology") amount = 450;

    const patientRef = doc(db, "patients", id);
    await updateDoc(patientRef, {
      bill: {
        amount,
        generatedAt: serverTimestamp()
      },
      status: "billed"
    });
    alert("Bill generated!");
    loadBillablePatients();
  } catch (err) {
    console.error("Error generating bill:", err);
    alert("Failed to generate bill.");
  }
};

// Generate PDF Bill (Fixed)
window.generatePDF = async (id) => {
  try {
    const patientRef = doc(db, "patients", id);
    const patientSnap = await getDoc(patientRef);
    const patient = patientSnap.data();

    const htmlContent = `
      <html>
        <head>
          <title>Patient Bill</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <h2>Prescription Receipt</h2>
          <p><strong>Token:</strong> ${patient.token}</p>
          <p><strong>Name:</strong> ${patient.name}</p>
          <p><strong>Age:</strong> ${patient.age}</p>
          <p><strong>Gender:</strong> ${patient.gender}</p>
          <p><strong>Treatment:</strong> ${patient.treatment}</p>
          <p><strong>Contact:</strong> ${patient.contact}</p>
          <p><strong>Prescription:</strong> ${patient.prescription || 'None'}</p>
          <p><strong>Amount:</strong> ₹${patient.bill.amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr/>
          <p style="text-align:center;">Thank you for visiting our clinic!</p>
        </body>
      </html>
    `;

    const billWindow = window.open('', '_blank');

    if (!billWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    billWindow.document.write(htmlContent);
    billWindow.document.close();

    billWindow.onload = () => {
      billWindow.focus();
      billWindow.print();
    };
  } catch (err) {
    console.error("Error generating PDF:", err);
    alert("Failed to generate PDF.");
  }
};

// Logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadBillablePatients();
  } else {
    window.location.href = "index.html";
  }
});
