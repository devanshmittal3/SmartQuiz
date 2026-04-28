// ============================================================
// admin-topics.js — Topic management (Create, Read, Update, Delete)
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { TOPIC_MAP } from "./topics.js";

let topics = [];
let domains = [];

function fallbackTopicsFromMap() {
  const result = [];
  Object.keys(TOPIC_MAP).forEach((domainId) => {
    TOPIC_MAP[domainId].forEach((topic) => {
      result.push({
        id: `${domainId}-${topic.id}`,
        domainId,
        topicName: topic.label
      });
    });
  });
  return result;
}

export async function setupTopicsSection() {
  const addBtn = document.getElementById("add-topic-btn");
  const domainFilter = document.getElementById("domain-filter");

  addBtn.addEventListener("click", () => openTopicModal(null));
  domainFilter.addEventListener("change", renderTopicsList);

  // Load domains for dropdown
  await loadDomainsForFilter();
  await loadTopics();
}

async function loadDomainsForFilter() {
  try {
    const snap = await getDocs(collection(db, "domains"));
    if (!snap.empty) {
      domains = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      domains = Object.keys(TOPIC_MAP).map((domainId) => ({
        id: domainId,
        name: domainId[0].toUpperCase() + domainId.slice(1),
        icon: "🗂️"
      }));
    }

    const filter = document.getElementById("domain-filter");
    const options = [
      '<option value="">All Domains</option>',
      ...domains.map(d => `<option value="${d.id}">${d.icon || '🗂️'} ${d.name}</option>`)
    ];
    filter.innerHTML = options.join("");
  } catch (error) {
    console.error("Error loading domains:", error);
    domains = Object.keys(TOPIC_MAP).map((domainId) => ({
      id: domainId,
      name: domainId[0].toUpperCase() + domainId.slice(1),
      icon: "🗂️"
    }));
    const filter = document.getElementById("domain-filter");
    const options = [
      '<option value="">All Domains</option>',
      ...domains.map(d => `<option value="${d.id}">${d.icon || '🗂️'} ${d.name}</option>`)
    ];
    filter.innerHTML = options.join("");
    showToast("Error loading domains for topics filter. Using fallback list.", "error");
  }
}

export async function loadTopics() {
  try {
    const snap = await getDocs(collection(db, "topics"));
    const localFallback = fallbackTopicsFromMap();
    if (!snap.empty) {
      const remoteTopics = snap.docs.map(t => ({ id: t.id, ...t.data() }));
      // Deduplicate: Firestore wins
      const seenTopIds = new Set(remoteTopics.map(rt => rt.id));
      topics = [...remoteTopics, ...localFallback.filter(lt => !seenTopIds.has(lt.id))];
    } else {
      topics = localFallback;
    }
    renderTopicsList();
  } catch (error) {
    console.error("Error loading topics:", error);
    topics = fallbackTopicsFromMap();
    renderTopicsList();
    showToast("Error loading topics from Firestore. Using fallback topics.", "error");
  }
}

function renderTopicsList() {
  const list = document.getElementById("topics-list");
  const selectedDomain = document.getElementById("domain-filter").value;

  const normalizedSelectedDomain = selectedDomain.toLowerCase();
  let filteredTopics = topics;
  if (selectedDomain) {
    filteredTopics = topics.filter(t => (t.domainId || "").toLowerCase() === normalizedSelectedDomain);
  }

  if (filteredTopics.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No topics found. Add one to get started!</p></div>';
    return;
  }

  list.innerHTML = filteredTopics.map(topic => {
    const domainName = domains.find(d => d.id === topic.domainId)?.name || "Unknown";
    return `
      <div class="admin-card">
        <div class="card-header">
          <h3>📚 ${topic.topicName}</h3>
          <div class="card-actions">
            <button class="btn-ghost edit-topic" data-id="${topic.id}">Edit</button>
            <button class="btn-danger delete-topic" data-id="${topic.id}">Delete</button>
          </div>
        </div>
        <p class="card-meta">Domain: ${domainName}</p>
        <p class="card-meta">ID: ${topic.id}</p>
      </div>
    `;
  }).join("");

  // Attach event listeners
  list.querySelectorAll(".edit-topic").forEach(btn => {
    btn.addEventListener("click", () => {
      const topic = topics.find(t => t.id === btn.dataset.id);
      openTopicModal(topic);
    });
  });

  list.querySelectorAll(".delete-topic").forEach(btn => {
    btn.addEventListener("click", () => {
      const topic = topics.find(t => t.id === btn.dataset.id);
      if (confirm(`Delete topic "${topic.topicName}"? This cannot be undone.`)) {
        deleteTopic(topic.id);
      }
    });
  });
}

function openTopicModal(topic) {
  const modal = document.getElementById("admin-modal");
  const modalBody = document.getElementById("modal-body");
  const isEditing = !!topic;

  const domainOptions = domains.map(d => 
    `<option value="${d.id}" ${topic?.domainId === d.id ? 'selected' : ''}>${d.icon || '🗂️'} ${d.name}</option>`
  ).join("");

  modalBody.innerHTML = `
    <h2>${isEditing ? "Edit Topic" : "Add New Topic"}</h2>
    <form id="topic-form">
      <div class="form-group">
        <label class="form-label">Domain</label>
        <select class="form-input" id="topic-domain" required>
          <option value="">Select a domain...</option>
          ${domainOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Topic Name</label>
        <input class="form-input" id="topic-name" type="text" value="${topic?.topicName || ''}" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Save Topic</button>
        <button type="button" class="btn-outline" id="modal-cancel">Cancel</button>
      </div>
    </form>
  `;

  modal.style.display = "flex";

  document.getElementById("topic-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const domainId = document.getElementById("topic-domain").value.trim();
    const topicName = document.getElementById("topic-name").value.trim();

    if (!domainId || !topicName) {
      showToast("All fields are required", "error");
      return;
    }

    if (isEditing) {
      await updateTopic(topic.id, { domainId, topicName });
    } else {
      await addTopic({ domainId, topicName });
    }

    modal.style.display = "none";
  });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

async function addTopic(data) {
  try {
    await addDoc(collection(db, "topics"), data);
    showToast("Topic added successfully", "success");
    await loadTopics();
  } catch (error) {
    console.error("Error adding topic:", error);
    showToast("Error adding topic", "error");
  }
}

async function updateTopic(id, data) {
  try {
    await updateDoc(doc(db, "topics", id), data);
    showToast("Topic updated successfully", "success");
    await loadTopics();
  } catch (error) {
    console.error("Error updating topic:", error);
    showToast("Error updating topic", "error");
  }
}

async function deleteTopic(id) {
  try {
    await deleteDoc(doc(db, "topics", id));
    showToast("Topic deleted successfully", "success");
    await loadTopics();
  } catch (error) {
    console.error("Error deleting topic:", error);
    showToast("Error deleting topic", "error");
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
