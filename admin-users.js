// ============================================================
// admin-users.js — User management
// ============================================================

const sanitizeString = (str) => {
  if (!str) return "";
  const s = String(str).trim();
  const bad = ["undefined", "null", "anonymous"];
  if (bad.includes(s.toLowerCase())) return "";
  return s;
};

import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let users = [];

export async function setupUsersSection() {
  await loadUsers();
  await loadLeaderboard();
}

export async function loadLeaderboard() {
  try {
    const lbQuery = query(
      collection(db, "quizAttempts"),
      orderBy("percentage", "desc"),
      limit(10)
    );
    const snap = await getDocs(lbQuery);
    const best = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderLeaderboard(best);
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    showToast("Error loading leaderboard", "error");
  }
}

function renderLeaderboard(list) {
  const board = document.getElementById("leaderboard-list");
  if (!board) return;

  if (!list || list.length === 0) {
    board.innerHTML = '<div class="empty-state"><p>No leaderboard entries yet.</p></div>';
    return;
  }

  board.innerHTML = list.map((entry, index) => {
    // Robust name/email fallback
    const rawEmail = sanitizeString(entry.email);
    const namePrefix = rawEmail ? rawEmail.split('@')[0] : "Learner";
    const displayName = sanitizeString(entry.name) || sanitizeString(entry.displayName) || namePrefix;

    return `
      <div class="admin-card">
        <div class="card-header">
          <h3>#${index + 1} ${displayName}</h3>
        </div>
        <p class="card-meta"><strong>Email:</strong> ${rawEmail || "N/A"}</p>
        <p class="card-meta">Score: ${entry.percentage}% (${entry.correct}/${entry.total})</p>
        <p class="card-meta">Domain: ${entry.domain} · Topic: ${entry.topic} · Difficulty: ${entry.difficulty}</p>
        <p class="card-meta">Date: ${entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleString() : "—"}</p>
      </div>
    `;
  }).join("");
}

export async function loadUsers() {
  try {
    console.log("admin-users.js: Loading users from Firestore");
    const snap = await getDocs(collection(db, "users"));
    console.log("admin-users.js: Users snapshot size", snap.size);

    users = snap.docs.map(u => {
      console.log("admin-users.js: User data", u.id, u.data());
      return { id: u.id, ...u.data() };
    });

    if (users.length === 0) {
      console.warn("admin-users.js: No users found in users collection; trying fallback from quizAttempts");
      const attemptsSnap = await getDocs(collection(db, "quizAttempts"));
      if (!attemptsSnap.empty) {
        const userMap = new Map();
        attemptsSnap.forEach((doc) => {
          const data = doc.data();
          if (!data.email || data.email === "undefined") return;

          if (!userMap.has(data.email)) {
            userMap.set(data.email, {
              id: null,
              name: data.email.split("@")[0],
              email: data.email,
              role: "student",
              createdAt: data.timestamp || null,
              totalQuizzes: 0,
              totalCorrect: 0,
              totalQuestions: 0,
              bestScore: 0,
              lastScore: 0,
            });
          }

          const u = userMap.get(data.email);
          u.totalQuizzes += 1;
          u.totalCorrect += Number(data.correct || 0);
          u.totalQuestions += Number(data.total || 0);
          u.lastScore = Number(data.percentage || 0);
          u.bestScore = Math.max(u.bestScore || 0, Number(data.percentage || 0));
        });

        users = Array.from(userMap.values());
        console.log("admin-users.js: Fallback users from quizAttempts", users.length);
      }
    }

    console.log("admin-users.js: Processed users", users.length);
    renderUsersList();
  } catch (error) {
    console.error("admin-users.js: Error loading users:", error);
    showToast("Error loading users", "error");
  }
}

function renderUsersList() {
  const list = document.getElementById("users-list");

  if (users.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No users found.</p></div>';
    return;
  }

  list.innerHTML = users.map(user => {
    const totalQuizzes = user.totalQuizzes || 0;
    const totalCorrect = user.totalCorrect || 0;
    const totalQuestions = user.totalQuestions || 0;
    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Robust name/email fallback
    const rawEmail = sanitizeString(user.email);
    const namePrefix = rawEmail ? rawEmail.split('@')[0] : "Learner";
    const displayName = sanitizeString(user.name) || sanitizeString(user.displayName) || namePrefix;

    return `
    <div class="admin-card">
      <div class="card-header">
        <h3>👤 ${displayName}</h3>
        <div class="card-actions">
          <button class="btn-ghost change-role" data-id="${user.id}" data-current="${user.role || 'user'}">
            ${user.role === "admin" ? "Demote" : "Promote"}
          </button>
          <button class="btn-danger delete-user" data-id="${user.id}">Delete</button>
        </div>
      </div>
      <p class="card-meta">Email: ${rawEmail || "N/A"}</p>
      <p class="card-meta">Role: <strong>${user.role === "admin" ? "🔐 Admin" : "📱 User"}</strong></p>
      <p class="card-meta">Joined: ${user.createdAt ? new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString() : "N/A"}</p>
      <p class="card-meta">Total Quizzes: ${totalQuizzes}</p>
      <p class="card-meta">Best Score: ${user.bestScore || 0}%</p>
      <p class="card-meta">Average Score: ${avgScore}%</p>
      <p class="card-meta">Last Score: ${user.lastScore || 0}%</p>
    </div>
  `;
  }).join("");

  // Attach event listeners
  list.querySelectorAll(".change-role").forEach(btn => {
    btn.addEventListener("click", () => {
      const userId = btn.dataset.id;
      const currentRole = btn.dataset.current;
      const newRole = currentRole === "admin" ? "user" : "admin";
      
      if (confirm(`Change role to "${newRole}"?`)) {
        changeUserRole(userId, newRole);
      }
    });
  });

  list.querySelectorAll(".delete-user").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Delete this user? This cannot be undone.")) {
        deleteUser(btn.dataset.id);
      }
    });
  });
}

async function changeUserRole(userId, newRole) {
  try {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    showToast(`User role changed to ${newRole}`, "success");
    await loadUsers();
  } catch (error) {
    console.error("Error changing user role:", error);
    showToast("Error changing user role", "error");
  }
}

async function deleteUser(userId) {
  try {
    await deleteDoc(doc(db, "users", userId));
    showToast("User deleted successfully", "success");
    await loadUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
    showToast("Error deleting user", "error");
  }
}

function showToast(message, type) {
  const toast = document.getElementById("admin-toast");
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
