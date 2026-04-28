// ============================================================
// admin-domains.js — Domain management (Create, Read, Update, Delete)
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const FALLBACK_DOMAINS = [
  { id: "mathematics", name: "Mathematics", icon: "➕" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "english", name: "English", icon: "📖" },
  { id: "computer", name: "Computer", icon: "💻" },
  { id: "sst", name: "SST", icon: "🌍" },
  { id: "hindi", name: "Hindi", icon: "🇮🇳" },
];

let domains = [];

export async function setupDomainsSection() {
  const addBtn = document.getElementById("add-domain-btn");
  const domainsList = document.getElementById("domains-list");

  addBtn.addEventListener("click", () => openDomainModal(null));

  await loadDomains();
}

export async function loadDomains() {
  try {
    const snap = await getDocs(collection(db, "domains"));
    if (!snap.empty) {
      domains = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      domains = FALLBACK_DOMAINS;
    }
    renderDomainsList();
  } catch (error) {
    console.error("Error loading domains:", error);
    domains = FALLBACK_DOMAINS;
    renderDomainsList();
    showToast("Error loading domains from Firestore. Using local fallback.", "error");
  }
}

function renderDomainsList() {
  const list = document.getElementById("domains-list");
  
  if (domains.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No domains yet. Add one to get started!</p></div>';
    return;
  }

  list.innerHTML = domains.map(domain => `
    <div class="admin-card">
      <div class="card-header">
        <h3>${domain.icon || '🗂️'} ${domain.name}</h3>
        <div class="card-actions">
          <button class="btn-ghost edit-domain" data-id="${domain.id}">Edit</button>
          <button class="btn-danger delete-domain" data-id="${domain.id}">Delete</button>
        </div>
      </div>
      <p class="card-meta">ID: ${domain.id}</p>
    </div>
  `).join("");

  // Attach event listeners
  list.querySelectorAll(".edit-domain").forEach(btn => {
    btn.addEventListener("click", () => {
      const domain = domains.find(d => d.id === btn.dataset.id);
      openDomainModal(domain);
    });
  });

  list.querySelectorAll(".delete-domain").forEach(btn => {
    btn.addEventListener("click", () => {
      const domain = domains.find(d => d.id === btn.dataset.id);
      if (confirm(`Delete domain "${domain.name}"? This cannot be undone.`)) {
        deleteDomain(domain.id);
      }
    });
  });
}

function openDomainModal(domain) {
  const modal = document.getElementById("admin-modal");
  const modalBody = document.getElementById("modal-body");
  const isEditing = !!domain;

  modalBody.innerHTML = `
    <h2>${isEditing ? "Edit Domain" : "Add New Domain"}</h2>
    <form id="domain-form">
      <div class="form-group">
        <label class="form-label">Domain Name</label>
        <input class="form-input" id="domain-name" type="text" value="${domain?.name || ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Icon Emoji</label>
        <input class="form-input" id="domain-icon" type="text" value="${domain?.icon || '🗂️'}" maxlength="2" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Save Domain</button>
        <button type="button" class="btn-outline" id="modal-cancel">Cancel</button>
      </div>
    </form>
  `;

  modal.style.display = "flex";

  document.getElementById("domain-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("domain-name").value.trim();
    const icon = document.getElementById("domain-icon").value.trim();

    if (!name) {
      showToast("Domain name is required", "error");
      return;
    }

    if (isEditing) {
      await updateDomain(domain.id, { name, icon });
    } else {
      await addDomain({ name, icon });
    }

    modal.style.display = "none";
  });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

async function addDomain(data) {
  try {
    await addDoc(collection(db, "domains"), data);
    showToast("Domain added successfully", "success");
    await loadDomains();
  } catch (error) {
    console.error("Error adding domain:", error);
    showToast("Error adding domain", "error");
  }
}

async function updateDomain(id, data) {
  try {
    await updateDoc(doc(db, "domains", id), data);
    showToast("Domain updated successfully", "success");
    await loadDomains();
  } catch (error) {
    console.error("Error updating domain:", error);
    showToast("Error updating domain", "error");
  }
}

async function deleteDomain(id) {
  try {
    await deleteDoc(doc(db, "domains", id));
    showToast("Domain deleted successfully", "success");
    await loadDomains();
  } catch (error) {
    console.error("Error deleting domain:", error);
    showToast("Error deleting domain", "error");
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
