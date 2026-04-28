# 🔐 SmartQuiz Admin - Quick Reference

## 🔑 Admin Login
**URL**: `/admin.html`  
**Role Required**: `role: "admin"` in Firestore  
**Sessions**: Stay logged in until manual logout

---

## 📊 Dashboard
**Location**: First section when you login  
**Shows**: 
- Total Domains
- Total Topics  
- Total Questions
- Total Users

---

## 🗂️ Manage Domains

### Add Domain
```
1. Click "+ Add Domain"
2. Enter name (e.g., "Mathematics")
3. Enter emoji icon (e.g., "➕")
4. Click "Save Domain"
```

### Edit Domain
```
1. Click "Edit" on domain card
2. Modify name/icon
3. Click "Save Domain"
```

### Delete Domain
```
1. Click "Delete" on domain card
2. Confirm deletion
3. Domain is removed
```

**Status**: Cards show all domains in real-time

---

## 📚 Manage Topics

### Prerequisites
- Must have at least one domain created

### Add Topic
```
1. Click "+ Add Topic"
2. Select a Domain (required)
3. Enter Topic Name (e.g., "Algebra")
4. Click "Save Topic"
```

### Filter Topics
```
1. Use Domain Filter dropdown
2. Select a domain to see only its topics
3. Select "All Domains" to see everything
```

### Edit Topic
```
1. Click "Edit" on topic card
2. Change domain/name
3. Click "Save Topic"
```

### Delete Topic
```
1. Click "Delete" on topic card
2. Confirm deletion
3. Topic is removed
```

**Status**: Topics show their parent domain

---

## ❓ Manage Questions

### Prerequisites
- Must have domains AND topics created

### Add Question
```
1. Click "+ Add Question"
2. Select Domain (dropdown populates topics automatically)
3. Select Topic (filtered by chosen domain)
4. Choose Difficulty: Easy / Medium / Hard
5. Enter Question Text
6. Fill all 4 Options
7. Select Correct Answer (0-3)
   - 0 = First option
   - 1 = Second option
   - 2 = Third option
   - 3 = Fourth option
8. Click "Save Question"
```

### Filter Questions
```
By Domain:
  - Select domain filter dropdown
  - Shows only questions for that domain

By Difficulty:
  - Select easy/medium/hard filter
  - Can combine with domain filter
```

### Edit Question
```
1. Find question with filters (if needed)
2. Click "Edit" on question card
3. Modify any field
4. Click "Save Question"
```

### Delete Question
```
1. Click "Delete" on question card
2. Confirm deletion
3. Question is removed permanently
```

**Status**: Questions show difficulty level, domain, and topic

---

## 👥 Manage Users

### View All Users
```
Each user shows:
- Name (from registration)
- Email
- Current Role (Admin/User)
- Account creation date
```

### Promote User to Admin
```
1. Find user in list
2. Click "Promote" button
3. Confirm action
4. User role changes to "🔐 Admin"
```

### Demote Admin to User
```
1. Find admin user in list
2. Click "Demote" button
3. Confirm action
4. User role changes to "📱 User"
```

### Delete User
```
1. Click "Delete" button on user card
2. Confirm deletion
3. User account is completely removed
```

---

## 🔔 Notifications

### Success Toast (Green)
```
✅ "Domain added successfully"
✅ "Topic updated successfully"
✅ "Question deleted successfully"
```

### Error Toast (Red)
```
❌ "Error loading domains"
❌ "All fields are required"
❌ "Error updating user"
```

**Duration**: Toasts appear for 3 seconds  
**Location**: Bottom right corner

---

## 🎯 Keyboard & UI Tips

### Modal Dialogs
- Press **Escape** = Close modal (or click ❌)
- Click outside = Close modal
- Click **Cancel** = Close without saving

### Form Validation
- Red error box appears if required fields missing
- Options must all be filled for questions
- Correct answer must be 0-3

### Responsive Design
- **Desktop**: Sidebar visible with labels
- **Tablet**: Sidebar icons only
- **Mobile**: Full-width layout

---

## 🚨 Important Operations

### ⚠️ Cannot Undo - Confirmation Required

These actions require confirmation:
- ✓ Delete Domain
- ✓ Delete Topic
- ✓ Delete Question
- ✓ Delete User

### 🔍 Find by Filtering

**Questions**: Use domain + difficulty filters together  
**Topics**: Filter by domain  
**Users**: Scroll to find (no filter available)

---

## 📱 Mobile Admin Access

Yes! Admin portal is fully responsive:

**On Mobile**:
1. Sidebar becomes icon-only (tap icon for tooltip)
2. Cards stack into single column
3. All functionality works the same
4. Modals are optimized for small screens

**Pro Tip**: Use mobile for quick edits on-the-go

---

## 🔄 Common Workflows

### Setup New Quiz
```
1. Go to "Manage Domains" → Add Domain
2. Go to "Manage Topics" → Add Topics for that domain
3. Go to "Manage Questions" → Add Questions for those topics
4. Go to Dashboard to verify all counts are correct
```

### Update Existing Question
```
1. Go to "Manage Questions"
2. Use filters to find the question
3. Click "Edit"
4. Modify content
5. Click "Save Question"
```

### Ban a User  
```
1. Go to "Manage Users"
2. Find the user
3. Click "Delete"
4. Confirm
```

### Create Admin Backup
```
1. Create a new regular user account
2. Promote them to admin (keep as backup)
3. Both can manage content
4. If one admin locked out, other can help
```

---

## 🎨 UI Elements Reference

| Element | Meaning | Color |
|---------|---------|-------|
| 🟢 Green toast | Success action | `#34d399` |
| 🔴 Red toast | Error/warning | `#f87171` |
| 🔵 Blue button | Primary action | `#4f8ef7` |
| ⚫ Gray button | Secondary action | `#8b92a8` |
| 🔴 Red button | Dangerous action (delete) | `#f87171` |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check role is "admin" in Firestore |
| Statistics show 0 | No content created yet - add domains/topics/questions |
| Topic dropdown empty | Must select domain first |
| Can't add question | Create domain and topic first |
| Form validation error | Check all fields are filled (4 options required) |
| Modal won't close | Click Cancel, ❌, or outside modal |
| Mobile sidebar cut off | Scroll left or tap sidebar area |

---

## 📞 Need Help?

- **Setup Issues**: Check [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Feature Details**: Check [ADMIN_PORTAL.md](./ADMIN_PORTAL.md)
- **Browser Console**: Press F12 → Console tab for errors
- **Firebase Console**: Check Firestore data directly

---

**Last Updated**: March 31, 2026  
**Admin Portal Version**: 1.0 ✅

Happy Managing! 🚀
