// ============================================================
// firebase.js — Initialize Firebase App + Export Services
// ============================================================
// 🔧 SETUP: Replace the firebaseConfig values below with your
//    own project credentials from the Firebase Console:
//    https://console.firebase.google.com/
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ─── Your Firebase Project Config ───────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBmjsUDnaJyM5IcHDDck5Bamurglj1FVTY",
  authDomain: "quiz-management-system-8837e.firebaseapp.com",
  projectId: "quiz-management-system-8837e",
  storageBucket: "quiz-management-system-8837e.firebasestorage.app",
  messagingSenderId: "279831595120",
  appId: "1:279831595120:web:260b35d705ef65563d0cb5",
  measurementId: "G-FV48FLZLWK"
};
// ────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Apply local persistence immediately so sessions survive page refreshes.
// We export the promise so other modules can await it if needed.
export const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to LOCAL (survives refresh)");
  })
  .catch((err) => {
    // Non-fatal — auth still works, just won't persist on some browsers
    console.warn("Firebase auth persistence warning:", err.code || err.message);
  });

// Check if running on file:// protocol
if (window.location.protocol === 'file:') {
  console.warn("Firebase auth may not work properly with file:// protocol. Please use a local server (e.g., python -m http.server or live-server).");
}
