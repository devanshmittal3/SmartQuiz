// ============================================================
// topics.js — Topic data + dynamic topic rendering
// ============================================================

// Static topic map — extend or replace with Firestore reads
export const TOPIC_MAP = {
  mathematics: [
    { id: "algebra",      label: "Algebra",       icon: "⚙️" },
    { id: "geometry",     label: "Geometry",       icon: "📐" },
    { id: "trigonometry", label: "Trigonometry",   icon: "📊" },
    { id: "calculus",     label: "Calculus",       icon: "∫" },
    { id: "statistics",   label: "Statistics",     icon: "📈" },
  ],
  science: [
    { id: "physics",   label: "Physics",   icon: "⚛️" },
    { id: "chemistry", label: "Chemistry", icon: "🧪" },
    { id: "biology",   label: "Biology",   icon: "🧬" },
  ],
  english: [
    { id: "grammar",      label: "Grammar",      icon: "📝" },
    { id: "vocabulary",   label: "Vocabulary",   icon: "📖" },
    { id: "comprehension",label: "Comprehension",icon: "🔍" },
    { id: "writing",      label: "Writing",      icon: "✍️" },
  ],
  computer: [
    { id: "programming", label: "Programming",    icon: "💻" },
    { id: "networking",  label: "Networking",     icon: "🌐" },
    { id: "database",    label: "Database",       icon: "🗄️" },
    { id: "os",          label: "Operating Sys.", icon: "🖥️" },
  ],
  sst: [
    { id: "history",   label: "History",   icon: "🏛️" },
    { id: "geography", label: "Geography", icon: "🌍" },
    { id: "civics",    label: "Civics",    icon: "⚖️" },
    { id: "economics", label: "Economics", icon: "💰" },
  ],
  hindi: [
    { id: "grammar-hi",  label: "व्याकरण",   icon: "📝" },
    { id: "literature",  label: "साहित्य",   icon: "📚" },
    { id: "comprehension-hi", label: "बोधन", icon: "🔍" },
  ],
};

// Import Firestore tools
import { db } from "./firebase-config.js";
import {
  collection, query, where, getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Resolve topic label from id + domain
export function getTopicLabel(domain, topicId) {
  const list = TOPIC_MAP[domain] || [];
  const foundLocal = list.find((t) => t.id === topicId);
  if (foundLocal) return foundLocal.label;
  
  // If not in local, it might be a custom ID - we'll just return the ID 
  // as a fallback (it will be refined in the UI)
  return topicId;
}

export async function renderTopics(domainId, containerEl, onSelect) {
  // 1. Get local static topics (Case-insensitive)
  const normalizedDomainId = domainId.toLowerCase();
  const localList = TOPIC_MAP[normalizedDomainId] || [];
  let combinedTopics = localList.map(t => ({
    id: t.id,
    label: t.label,
    icon: t.icon || "📚"
  }));

  // 2. Fetch Firestore topics for this domain
  try {
    // We check for both case-sensitive and case-insensitive domain matches
    const q = query(
      collection(db, "topics"),
      where("domainId", "in", [domainId, domainId.toLowerCase()])
    );
    
    // Also check for "domain" field name variants
    const qAlt = query(
      collection(db, "topics"),
      where("domain", "in", [domainId, domainId.toLowerCase()])
    );

    const [snap, snapAlt] = await Promise.all([getDocs(q), getDocs(qAlt)]);
    
    const remoteDocs = [...snap.docs, ...snapAlt.docs];
    const remoteTopics = remoteDocs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.topicName || data.name || "Untitled Topic",
        icon: data.icon || "📚"
      };
    });

    // Merge without duplicates (using ID as unique key)
    const seen = new Set(combinedTopics.map(t => t.id));
    remoteTopics.forEach(rt => {
      if (!seen.has(rt.id)) {
        combinedTopics.push(rt);
        seen.add(rt.id);
      }
    });
  } catch (error) {
    console.warn("renderTopics: Firestore fetch failed, using local only", error);
  }

  // 3. Render
  if (combinedTopics.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔎</span>
        <p>No topics found for this domain.</p>
        <p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">Try adding topics in the Admin Panel.</p>
      </div>`;
    return;
  }

  containerEl.innerHTML = combinedTopics
    .map(
      (t, i) => `
    <button
      class="topic-card"
      data-topic="${t.id}"
      style="animation-delay:${i * 60}ms"
      aria-label="Select topic ${t.label}"
    >
      <span class="topic-icon">${t.icon}</span>
      <span class="topic-label">${t.label}</span>
      <span class="topic-arrow">→</span>
    </button>`
    )
    .join("");

  containerEl.querySelectorAll(".topic-card").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.topic));
  });
}
