# SmartQuiz 🎓

A modern, dark-themed quiz web application built with Vanilla JS + Firebase.

---

## 📁 Project Structure

```
smartquiz/
├── index.html          ← Auth page (Login / Register)
├── domains.html        ← Dashboard — pick a subject
├── topics.html         ← Pick a topic within subject
├── difficulty.html     ← Choose Easy / Medium / Hard
├── quiz.html           ← The actual quiz engine
│
├── css/
│   └── style.css       ← All styles (dark luxury theme)
│
├── js/
│   ├── firebase.js     ← Firebase init + exports
│   ├── auth.js         ← Auth functions (login/register/logout/guard)
│   ├── topics.js       ← Topic data + rendering
│   ├── questions.js    ← Full question bank + Firestore fetcher
│   └── quiz.js         ← Quiz engine (render, navigate, score, result)
│
├── seed-firestore.js   ← Node script to seed Firestore domains
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **Add project** → name it (e.g. "SmartQuiz") → Continue
3. Disable Google Analytics (optional) → Create project

### 2. Enable Authentication

1. In Firebase Console → **Authentication** → Get started
2. Enable **Email/Password** provider → Save

### 3. Create Firestore Database

1. **Firestore Database** → Create database
2. Choose **Start in test mode** (for development)
3. Pick a region → Done

### 4. Get Your Config Keys

1. **Project Settings** (gear icon) → **Your apps** → Web (`</>`)
2. Register app → copy the `firebaseConfig` object

### 5. Add Config to the Project

Open `js/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_ACTUAL_API_KEY",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc123",
};
```

### 6. Seed Firestore Domains (Optional)

The app works without Firestore using fallback data.
To seed domains into Firestore:

```bash
npm install firebase-admin
# Download your service account key from Firebase Console →
# Project Settings → Service accounts → Generate new private key
# Save it as serviceAccountKey.json in the project root
node seed-firestore.js
```

### 7. Run the App

Since the app uses ES modules, you need a local server:

```bash
# Option A — VS Code Live Server extension (recommended)
# Right-click index.html → Open with Live Server

# Option B — Python
python -m http.server 8080

# Option C — Node (serve package)
npx serve .
```

Then open: [http://localhost:8080](http://localhost:8080)

---

## 🎮 How It Works

| Step | Page | What happens |
|------|------|--------------|
| 1 | `index.html` | Login or Register |
| 2 | `domains.html` | Pick a subject (Math, Science, etc.) |
| 3 | `topics.html` | Pick a topic (Algebra, Physics, etc.) |
| 4 | `difficulty.html` | Choose Easy / Medium / Hard |
| 5 | `quiz.html` | Take the quiz, get instant results |

---

## 📊 Firestore Schema

```
users/
  {uid}: { name, email, role, createdAt }

domains/
  mathematics: { name: "Mathematics", icon: "➕" }
  science:     { name: "Science",     icon: "🔬" }
  ...

questions/
  {id}: {
    domain:     "mathematics",
    topic:      "algebra",
    difficulty: "easy",
    q:          "Solve for x: 2x + 4 = 10",
    options:    ["2","3","4","5"],
    answer:     1   ← 0-based index
  }
```

---

## ✨ Features

- 🔐 Firebase Auth (register + login + logout)
- 🗄️ Firestore integration with local fallback
- 📚 150+ questions across 6 domains
- 🎯 3 difficulty levels per topic
- 📊 Score calculation + answer review
- ⬅️ Previous / Next navigation
- 📱 Fully responsive
- ⚡ ES Modules (no bundler needed)
- 🎨 Dark luxury UI with smooth animations
- 🔧 **Full Admin Portal** for content management

---

## 🔐 Admin Portal

SmartQuiz includes a complete admin dashboard for managing all content!

### 🚀 Quick Start
1. Register a user account
2. Set `role: "admin"` in Firestore `users` collection
3. Go to `/admin.html` and login
4. Manage domains, topics, questions, and users

### ✨ Admin Features
- 📊 **Dashboard**: View statistics (domains, topics, questions, users)
- 🗂️ **Manage Domains**: Add, edit, delete quiz categories
- 📚 **Manage Topics**: Organize topics under domains
- ❓ **Manage Questions**: Full CRUD for questions with validation
- 👥 **Manage Users**: Promote/demote admins, delete users
- 🎨 **Modern UI**: Dark theme matching the main app
- 📱 **Responsive**: Works on desktop, tablet, and mobile

### 📁 Admin Files
```
admin.html              ← Admin login page
admin-dashboard.html    ← Main admin interface
admin-auth.js          ← Admin authentication
admin-dashboard.js     ← Dashboard statistics
admin-domains.js       ← Domain management
admin-topics.js        ← Topic management
admin-questions.js     ← Question management
admin-users.js         ← User management
```

### 📖 Full Documentation
- **[ADMIN_PORTAL.md](./ADMIN_PORTAL.md)** - Complete admin portal documentation
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Step-by-step setup guide

---

## 🔧 Adding More Questions

Edit `js/questions.js`:

```javascript
export const QUESTIONS = {
  mathematics: {
    algebra: {
      easy: [
        {
          q: "Your question here?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: 0  // ← index of correct option (0-based)
        },
        // ...
      ]
    }
  }
};
```

Or add questions directly to Firestore with matching fields.

---

## 🛡️ Security Notes

- Enable **Firestore Security Rules** before going to production
- Restrict read/write to authenticated users only:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /domains/{doc} {
      allow read: if request.auth != null;
    }
    match /questions/{doc} {
      allow read: if request.auth != null;
    }
  }
}
```
