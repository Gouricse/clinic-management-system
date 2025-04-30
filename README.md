
# 🏥 Clinic Management System

A complete web-based Clinic Management System using **HTML, CSS, JavaScript, and Firebase** that helps streamline clinic operations like token generation, patient data storage, doctor prescriptions, billing, and appointment handling.

---

## 🚀 Live Demo

🌐 [View Live Project] (https://clinic-management-system-6ae1e.web.app)


## 🧠 Features

### 🧑‍⚕️ Doctor Module
- Secure login
- View tokenized patient queue
- View patient details
- Add diagnosis and prescription
- View past history

### 👩‍💼 Receptionist Module
- Login securely
- Auto-generate patient tokens
- Enter patient details (Name, Age, Gender, Treatment Type)
- Generate and print bills (with treatment-specific costs)
- Store bills in Firebase and show billing history

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend/Database**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **PDF/Bill Printing**: JS Print Window
- **Deployment**: Firebase Hosting

---

## 🔧 Project Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Gouricse/clinic_management-system.git
cd clinic_management-system

// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



