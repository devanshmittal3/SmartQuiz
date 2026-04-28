// ============================================================
// admin-dashboard.js — Dashboard statistics and overview
// ============================================================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { TOPIC_MAP } from "./topics.js";
import { QUESTIONS } from "./questions.js";

const FALLBACK_DOMAINS = [
  { id: "mathematics", name: "Mathematics", icon: "➕" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "english", name: "English", icon: "📖" },
  { id: "computer", name: "Computer", icon: "💻" },
  { id: "sst", name: "SST", icon: "🌍" },
  { id: "hindi", name: "Hindi", icon: "🇮🇳" },
];

function countFallbackTopics() {
  return Object.values(TOPIC_MAP).reduce((total, topicArr) => total + topicArr.length, 0);
}

function countFallbackQuestions() {
  let total = 0;
  if (!QUESTIONS) return 0;
  
  for (const domain in QUESTIONS) {
    if (typeof QUESTIONS[domain] !== 'object') continue;
    for (const topic in QUESTIONS[domain]) {
      if (typeof QUESTIONS[domain][topic] !== 'object') continue;
      for (const difficulty in QUESTIONS[domain][topic]) {
        const questions = QUESTIONS[domain][topic][difficulty];
        if (Array.isArray(questions)) {
          total += questions.length;
        }
      }
    }
  }
  return total;
}

export async function loadDashboard() {
  try {
    const domainsSnap = await getDocs(collection(db, "domains"));
    const topicsSnap = await getDocs(collection(db, "topics"));
    const questionsSnap = await getDocs(collection(db, "questions"));
    const usersSnap = await getDocs(collection(db, "users"));

    const domainCount = Number(domainsSnap.size) || FALLBACK_DOMAINS.length;
    const topicCount = Number(topicsSnap.size) || countFallbackTopics();
    const questionCount = Number(questionsSnap.size) + countFallbackQuestions();
    const userCount = Number(usersSnap.size) || 0;

    document.getElementById("stat-domains").textContent = domainCount;
    document.getElementById("stat-topics").textContent = topicCount;
    document.getElementById("stat-questions").textContent = questionCount;
    document.getElementById("stat-users").textContent = userCount;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    document.getElementById("stat-domains").textContent = FALLBACK_DOMAINS.length;
    document.getElementById("stat-topics").textContent = countFallbackTopics();
    document.getElementById("stat-questions").textContent = countFallbackQuestions();
    document.getElementById("stat-users").textContent = 0;
    showToast("Error loading statistics, using local fallback values", "error");
  }
}

function showToast(message, type) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
