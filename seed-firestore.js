// ============================================================
// seed-firestore.js — Seed Firestore with domains
// Run with Node.js:  node seed-firestore.js
// Requires:  npm install firebase-admin
// ============================================================
// Set your service account key path below before running.

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // ← your file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  const domains = [
    { name: "Mathematics", icon: "➕" },
    { name: "Science",     icon: "🔬" },
    { name: "English",     icon: "📖" },
    { name: "Computer",    icon: "💻" },
    { name: "SST",         icon: "🌍" },
    { name: "Hindi",       icon: "🇮🇳" },
  ];

  const batch = db.batch();

  for (const domain of domains) {
    const ref = db.collection("domains").doc(domain.name.toLowerCase());
    batch.set(ref, domain);
    console.log(`✓ Queued domain: ${domain.name}`);
  }

  await batch.commit();
  console.log("\n✅ Domains seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
