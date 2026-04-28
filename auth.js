// ============================================================
// auth.js — Authentication: Register, Login, Logout, Guard
// ============================================================

import { auth, db, authReady } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Register ───────────────────────────────────────────────
export async function register(name, email, password) {
  console.log("register: Starting registration for", email);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  console.log("register: Auth successful for", cred.user.email);

  const userData = {
    name: (name && name !== "undefined") ? name : email.split("@")[0],
    email,
    role: "student",
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    totalQuizzes: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    lastScore: 0,
    leaderboardRank: null,
  };
  console.log("register: Creating user document with", userData);
  await setDoc(doc(db, "users", cred.user.uid), userData);
  console.log("register: User document created");
  return cred.user;
}

// ─── Login ──────────────────────────────────────────────────
export async function login(email, password) {
  console.log("login: Starting login process for", email);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  console.log("login: Auth successful for", cred.user.email);

  const userRef = doc(db, "users", cred.user.uid);
  console.log("login: Checking if user document exists for", cred.user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    console.log("login: User document doesn't exist, creating...");
    const userData = {
      name: cred.user.displayName || cred.user.email.split("@")[0],
      email: cred.user.email,
      role: "student",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestScore: 0,
      lastScore: 0,
      leaderboardRank: null,
    };
    console.log("login: Creating user document with", userData);
    await setDoc(userRef, userData);
    console.log("login: User document created");
  } else {
    console.log("login: User document exists, updating...");
    const u = userSnapshot.data();
    console.log("login: Existing user data", u);
    const updateData = {
      lastLogin: serverTimestamp(),
      role: u.role || "student",
      totalQuizzes: u.totalQuizzes || 0,
      totalCorrect: u.totalCorrect || 0,
      totalQuestions: u.totalQuestions || 0,
      bestScore: u.bestScore || 0,
      lastScore: u.lastScore || 0,
    };
    console.log("login: Updating user document with", updateData);
    await setDoc(userRef, updateData, { merge: true });
    console.log("login: User document updated");
  }

  console.log("login: Login process complete");
  return cred.user;
}

// ─── Logout ─────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

// ─── Auth Guard: redirect to login if not authenticated ─────
export function requireAuth(callback) {
  console.log("requireAuth: Called on", window.location.pathname);

  // Check if running on file:// protocol
  if (window.location.protocol === 'file:') {
    console.error("requireAuth: Firebase auth doesn't work with file:// protocol. Please use a local server.");
    alert("Please run this app using a local server (e.g., python -m http.server 8000) instead of opening files directly.");
    return;
  }

  let settled = false;

  // Generous timeout — only fires if Firebase completely fails to respond
  const authTimeout = setTimeout(() => {
    if (!settled) {
      settled = true;
      console.warn("requireAuth: Auth state timed out (15s). Redirecting to login.");
      window.location.href = "index.html";
    }
  }, 15000);

  // Wait for persistence to be applied, THEN subscribe to auth state.
  // This ensures the stored session token is loaded before we check.
  authReady.then(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (settled) return;
      settled = true;
      clearTimeout(authTimeout);
      unsubscribe();

      console.log("requireAuth: onAuthStateChanged →", user ? user.email : "no user");

      if (!user) {
        console.log("requireAuth: Not authenticated. Redirecting to login.");
        window.location.href = "index.html";
      } else {
        try {
          callback(user);
        } catch (error) {
          console.error("requireAuth: Callback threw an error", error);
        }
      }
    });
  });
}

// ─── Get current user (one-shot) ────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}
