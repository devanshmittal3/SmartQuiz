// ============================================================
// admin-questions.js — Question management (Create, Read, Update, Delete)
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { TOPIC_MAP } from "./topics.js";
import { QUESTIONS } from "./questions.js";

let questions = [];
let domains = [];
let topics = [];

function fallbackQuestionsFromLocal() {
  const list = [];
  Object.entries(QUESTIONS).forEach(([domainId, domainTopics]) => {
    Object.entries(domainTopics).forEach(([topicId, topicDifficulties]) => {
      Object.entries(topicDifficulties).forEach(([diff, qArr]) => {
        qArr.forEach((q, idx) => {
          list.push({
            id: `${domainId}_${topicId}_${diff}_${idx}`,
            domain: domainId,
            topic: topicId,
            difficulty: diff,
            question: q.q,
            options: q.options,
            answer: q.answer,
          });
        });
      });
    });
  });
  return list;
}

export async function setupQuestionsSection() {
  const addBtn = document.getElementById("add-question-btn");
  const domainFilter = document.getElementById("question-domain-filter");
  const difficultyFilter = document.getElementById("question-difficulty-filter");

  addBtn.addEventListener("click", () => openQuestionModal(null));
  domainFilter.addEventListener("change", renderQuestionsList);
  difficultyFilter.addEventListener("change", renderQuestionsList);

  await loadDomainsAndTopics();
  await loadQuestions();
}

async function loadDomainsAndTopics() {
  try {
    const domSnap = await getDocs(collection(db, "domains"));
    const localDomains = Object.keys(TOPIC_MAP).map((domainId) => ({
      id: domainId,
      name: domainId[0].toUpperCase() + domainId.slice(1),
      icon: "🗂️"
    }));

    if (!domSnap.empty) {
      const remoteDomains = domSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Deduplicate: Firestore wins
      const seenDomIds = new Set(remoteDomains.map(d => d.id.toLowerCase()));
      domains = [...remoteDomains, ...localDomains.filter(ld => !seenDomIds.has(ld.id.toLowerCase()))];
    } else {
      domains = localDomains;
    }

    const topSnap = await getDocs(collection(db, "topics"));
    const localTopics = [];
    Object.keys(TOPIC_MAP).forEach((domainId) => {
      TOPIC_MAP[domainId].forEach((topic) => {
        localTopics.push({
          id: `${domainId}-${topic.id}`,
          domainId,
          topicName: topic.label
        });
      });
    });

    if (!topSnap.empty) {
      const remoteTopics = topSnap.docs.map(t => ({ id: t.id, ...t.data() }));
      // Deduplicate: Firestore wins
      const seenTopIds = new Set(remoteTopics.map(t => t.id));
      topics = [...remoteTopics, ...localTopics.filter(lt => !seenTopIds.has(lt.id))];
    } else {
      topics = localTopics;
    }

    const filter = document.getElementById("question-domain-filter");
    const options = [
      '<option value="">All Domains</option>',
      ...domains.map(d => `<option value="${d.id}">${d.icon || '🗂️'} ${d.name}</option>`)
    ];
    filter.innerHTML = options.join("");
  } catch (error) {
    console.error("Error loading domains and topics:", error);
    domains = Object.keys(TOPIC_MAP).map((domainId) => ({
      id: domainId,
      name: domainId[0].toUpperCase() + domainId.slice(1),
      icon: "🗂️"
    }));
    topics = [];
    Object.keys(TOPIC_MAP).forEach((domainId) => {
      TOPIC_MAP[domainId].forEach((topic) => {
        topics.push({
          id: `${domainId}-${topic.id}`,
          domainId,
          topicName: topic.label
        });
      });
    });

    const filter = document.getElementById("question-domain-filter");
    const options = [
      '<option value="">All Domains</option>',
      ...domains.map(d => `<option value="${d.id}">${d.icon || '🗂️'} ${d.name}</option>`)
    ];
    filter.innerHTML = options.join("");
    showToast("Error loading domain/topic data from Firestore. Using local fallback values.", "error");
  }
}

export async function loadQuestions() {
  try {
    const qSnap = await getDocs(collection(db, "questions"));
    const localFallback = fallbackQuestionsFromLocal();
    if (!qSnap.empty) {
      const remoteQuestions = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Merge: Local + Remote
      questions = [...localFallback, ...remoteQuestions];
    } else {
      questions = localFallback;
    }
    renderQuestionsList();
  } catch (error) {
    console.error("Error loading questions:", error);
    questions = fallbackQuestionsFromLocal();
    renderQuestionsList();
    showToast("Error loading questions from Firestore. Using fallback questions.", "error");
  }
}

function renderQuestionsList() {
  const list = document.getElementById("questions-list");
  const selectedDomain = document.getElementById("question-domain-filter").value;
  const selectedDifficulty = document.getElementById("question-difficulty-filter").value;

  let filtered = questions;
  if (selectedDomain) {
    filtered = filtered.filter(q => q.domain === selectedDomain);
  }
  if (selectedDifficulty) {
    filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No questions found. Add one to get started!</p></div>';
    return;
  }

  list.innerHTML = filtered.map(question => {
    const domainName = domains.find(d => d.id === question.domain)?.name || "Unknown";
    const topicName = topics.find(t => t.id === question.topic || t.topicName === question.topic)?.topicName || "Unknown";
    const diffColor = {
      easy: "🟢",
      medium: "🟡",
      hard: "🔴"
    };

    return `
      <div class="admin-card">
        <div class="card-header">
          <h3>❓ ${question.question.substring(0, 60)}${question.question.length > 60 ? '...' : ''}</h3>
          <div class="card-actions">
            <button class="btn-ghost edit-question" data-id="${question.id}">Edit</button>
            <button class="btn-danger delete-question" data-id="${question.id}">Delete</button>
          </div>
        </div>
        <p class="card-meta">${diffColor[question.difficulty] || '❓'} ${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)} | ${domainName} > ${topicName}</p>
        <p class="card-meta">Options: ${question.options?.length || 0} | Answer: ${question.answer !== undefined ? question.answer + 1 : 'N/A'}</p>
      </div>
    `;
  }).join("");

  // Attach event listeners
  list.querySelectorAll(".edit-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const question = questions.find(q => q.id === btn.dataset.id);
      openQuestionModal(question);
    });
  });

  list.querySelectorAll(".delete-question").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Delete this question? This cannot be undone.")) {
        deleteQuestion(btn.dataset.id);
      }
    });
  });
}

function openQuestionModal(question) {
  const modal = document.getElementById("admin-modal");
  const modalBody = document.getElementById("modal-body");
  const isEditing = !!question;

  const domainOptions = domains.map(d => 
    `<option value="${d.id}" ${question?.domain === d.id ? 'selected' : ''}>${d.icon || '🗂️'} ${d.name}</option>`
  ).join("");

  const topicsForDomain = question
    ? topics.filter(t => (t.domainId || t.domain || "").toLowerCase() === (question.domain || "").toLowerCase())
    : [];

  const topicOptions = topicsForDomain.map(t => 
    `<option value="${t.id}" ${question?.topic === t.id ? 'selected' : ''}>${t.topicName}</option>`
  ).join("");

  const optionsHTML = question?.options?.map((opt, idx) => `
    <div class="form-group">
      <label class="form-label">Option ${idx + 1}</label>
      <input class="form-input" class="question-option" data-idx="${idx}" type="text" value="${opt}" required />
    </div>
  `).join("") || Array(4).fill(0).map((_, idx) => `
    <div class="form-group">
      <label class="form-label">Option ${idx + 1}</label>
      <input class="form-input question-option" data-idx="${idx}" type="text" required />
    </div>
  `).join("");

  modalBody.innerHTML = `
    <h2>${isEditing ? "Edit Question" : "Add New Question"}</h2>
    <form id="question-form">
      <div class="form-group">
        <label class="form-label">Domain</label>
        <select class="form-input" id="q-domain" required>
          <option value="">Select a domain...</option>
          ${domainOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Topic</label>
        <select class="form-input" id="q-topic" required>
          <option value="">Select a topic...</option>
          ${topicOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Difficulty</label>
        <select class="form-input" id="q-difficulty" required>
          <option value="easy" ${question?.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
          <option value="medium" ${question?.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="hard" ${question?.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Question Text</label>
        <textarea class="form-input" id="q-text" required style="min-height: 80px;">${question?.question || ''}</textarea>
      </div>
      
      <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
        <h3>Options</h3>
        ${optionsHTML}
      </div>

      <div class="form-group">
        <label class="form-label">Correct Answer (0-3)</label>
        <input class="form-input" id="q-answer" type="number" min="0" max="3" value="${question?.answer !== undefined ? question.answer : ''}" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Save Question</button>
        <button type="button" class="btn-outline" id="modal-cancel">Cancel</button>
      </div>
    </form>
  `;
  modal.style.display = "flex";

  // Handle domain change to update topics in modal
  document.getElementById("q-domain").addEventListener("change", (e) => {
    const domainId = e.target.value;
    const domainObj = domains.find(d => d.id === domainId || d.name === domainId);
    const domainName = domainObj?.name || "";

    const availableTopics = topics.filter(t => {
      const tDom = (t.domainId || t.domain || "").toLowerCase();
      const dId  = (domainId || "").toLowerCase();
      const dName = (domainName || "").toLowerCase();
      return tDom === dId || (dName && tDom === dName);
    });

    const topicSelect = document.getElementById("q-topic");
    topicSelect.innerHTML = [
      '<option value="">Select a topic...</option>',
      ...availableTopics.map(t => {
        const label = t.topicName || t.name || t.label || "Untitled Topic";
        return `<option value="${t.id}">${label}</option>`;
      })
    ].join("");
  });

  document.getElementById("question-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      domain: document.getElementById("q-domain").value,
      topic: document.getElementById("q-topic").value,
      difficulty: document.getElementById("q-difficulty").value,
      question: document.getElementById("q-text").value.trim(),
      options: Array.from(document.querySelectorAll(".question-option")).map(inp => inp.value.trim()),
      answer: parseInt(document.getElementById("q-answer").value)
    };

    if (!data.domain || !data.topic || !data.question || data.options.some(o => !o)) {
      showToast("All fields are required", "error");
      return;
    }

    if (data.answer < 0 || data.answer > 3) {
      showToast("Correct answer must be between 0 and 3", "error");
      return;
    }

    if (isEditing) {
      await updateQuestion(question.id, data);
    } else {
      await addQuestion(data);
    }

    modal.style.display = "none";
  });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

async function addQuestion(data) {
  try {
    await addDoc(collection(db, "questions"), data);
    showToast("Question added successfully", "success");
    await loadQuestions();
  } catch (error) {
    console.error("Error adding question:", error);
    showToast("Error adding question", "error");
  }
}

async function updateQuestion(id, data) {
  try {
    await updateDoc(doc(db, "questions", id), data);
    showToast("Question updated successfully", "success");
    await loadQuestions();
  } catch (error) {
    console.error("Error updating question:", error);
    showToast("Error updating question", "error");
  }
}

async function deleteQuestion(id) {
  try {
    await deleteDoc(doc(db, "questions", id));
    showToast("Question deleted successfully", "success");
    await loadQuestions();
  } catch (error) {
    console.error("Error deleting question:", error);
    showToast("Error deleting question", "error");
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
