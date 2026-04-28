// ============================================================
// admin-auth.js — Admin Authentication with role verification
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Admin Login ─────────────────────────────────────────────
export async function adminLogin(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Check if user has admin role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    if (userData.role !== "admin") {
      await signOut(auth);
      throw new Error("Access denied. Admin privileges required.");
    }

    // Store admin info for later use
    localStorage.setItem("adminEmail", user.email);
    localStorage.setItem("adminUid", user.uid);

    return user;
  } catch (error) {
    console.error("Admin login error:", error);
    throw new Error(error.message || "Login failed");
  }
}

// ─── Logout ──────────────────────────────────────────────────
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminUid");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// ─── Require Admin Auth Guard ────────────────────────────────
export function requireAdminAuth(callback) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "admin.html";
        reject(new Error("Not authenticated"));
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists() || userDoc.data().role !== "admin") {
          await signOut(auth);
          window.location.href = "admin.html";
          reject(new Error("Not admin"));
          return;
        }

        // Store admin info
        localStorage.setItem("adminEmail", user.email);
        localStorage.setItem("adminUid", user.uid);

        if (callback) callback(user);
        resolve(user);
      } catch (error) {
        console.error("Auth guard error:", error);
        reject(error);
      }
    });
  });
}

// ─── Get current admin user ──────────────────────────────────
export function getCurrentAdminUser() {
  return {
    email: localStorage.getItem("adminEmail"),
    uid: localStorage.getItem("adminUid")
  };
}
