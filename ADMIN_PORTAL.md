# SmartQuiz Admin Portal Documentation

## Overview
The admin portal allows administrators to manage all content in the SmartQuiz platform including domains, topics, questions, and users.

## 🔐 Authentication & Setup

### Admin Account Requirements
1. User must have a Firebase account with `role: "admin"` set in Firestore
2. To create an admin user:
   - Register normally at `/index.html`
   - Manually set `role: "admin"` in Firestore collection `users` → document with user's UID

### Admin Login
- Navigate to `/admin.html`
- Use your admin credentials to login
- You'll be redirected to the admin dashboard automatically

## 📋 Firestore Collections Structure

### Users Collection
```
users/
  {userId}/
    - name: string
    - email: string
    - role: "user" | "admin"
    - createdAt: timestamp
```

### Domains Collection
```
domains/
  {domainId}/
    - name: string (e.g., "Mathematics")
    - icon: string (emoji, e.g., "➕")
```

### Topics Collection
```
topics/
  {topicId}/
    - domainId: string (reference to domains/)
    - topicName: string (e.g., "Algebra")
```

### Questions Collection
```
questions/
  {questionId}/
    - domain: string (domainId)
    - topic: string (topicId)
    - difficulty: "easy" | "medium" | "hard"
    - question: string (the question text)
    - options: array[string] (4 options)
    - answer: number (0-3, index of correct option)
```

## 🎯 Admin Dashboard Features

### 1. Dashboard Section
- View statistics:
  - Total Domains
  - Total Topics
  - Total Questions
  - Total Users
- Quick overview of platform state

### 2. Manage Domains
**Actions:**
- ✅ Add new domain with name and emoji icon
- ✏️ Edit existing domain
- 🗑️ Delete domain

**Features:**
- Display all domains in card format
- Confirmation before deletion
- Toast notifications for success/error

### 3. Manage Topics
**Actions:**
- ✅ Add new topic (requires domain selection)
- ✏️ Edit topic
- 🗑️ Delete topic

**Features:**
- Filter topics by domain
- Display domain association
- Cascade validation (topic requires valid domain)

### 4. Manage Questions
**Actions:**
- ✅ Add question with full details
- ✏️ Edit question
- 🗑️ Delete question

**Features:**
- Filter by domain AND difficulty
- Domain-topic relationship (changing domain updates topic options)
- Validate all 4 options are provided
- Confirm correct answer selection (0-3)
- Full text editor for questions

**Question Form Fields:**
```
- Domain (required, dropdown)
- Topic (required, filtered by domain)
- Difficulty (easy/medium/hard)
- Question Text (required)
- Option 1-4 (required)
- Correct Answer (0-3)
```

### 5. Manage Users
**Actions:**
- 👤 View all users with details
- ⬆️ Promote user to admin
- ⬇️ Demote admin to user
- 🗑️ Delete user

**Display Info:**
- User name
- Email
- Current role
- Account creation date

## 🎨 UI Features

### Design Elements
- Dark modern theme (matches main app)
- Sidebar navigation with icons
- Top bar showing current admin user
- Card-based layouts
- Responsive design (desktop, tablet, mobile)

### Interactions
- Smooth hover effects
- Modal dialogs for add/edit operations
- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Animated transitions between sections

### Responsive Breakpoints
- **Desktop (>768px)**: Full sidebar + full content
- **Tablet (640-768px)**: Sidebar with labels, stacked cards
- **Mobile (<640px)**: Icon-only sidebar, single-column layouts

## 🔗 File Structure

```
/
├── admin.html                 # Admin login page
├── admin-dashboard.html       # Main admin dashboard
├── admin-auth.js             # Authentication module
├── admin-dashboard.js        # Dashboard statistics
├── admin-domains.js          # Domain management
├── admin-topics.js           # Topic management
├── admin-questions.js        # Question management
├── admin-users.js            # User management
├── firebase.js               # Firebase config (shared)
├── style.css                 # All styles (including admin)
└── ... (other user-facing files)
```

## 🚀 Workflow Examples

### Adding a New Question
1. Navigate to "Manage Questions"
2. Click "+ Add Question"
3. Select domain (e.g., "Mathematics")
4. Topic field auto-updates with topics from that domain
5. Select topic (e.g., "Algebra")
6. Choose difficulty level
7. Enter question text
8. Fill all 4 options
9. Select correct answer (0-3)
10. Click "Save Question"
11. Toast shows success message

### Managing a Domain
1. Go to "Manage Domains"
2. View all domains as cards
3. Click "Edit" to modify name/icon
4. Click "Delete" with confirmation
5. Changes update real-time in Firestore

### User Role Management
1. Navigate to "Manage Users"
2. Find user you want to modify
3. Click "Promote" to make admin or "Demote" to remove admin
4. Click "Delete" to remove user (with confirmation)
5. Updates reflect immediately

## 🔒 Security Considerations

### What This Guards Against
✅ Only users with `role: "admin"` can access admin portal
✅ Non-admin accounts are redirected to admin.html
✅ Sign-out on auth failures
✅ Confirmation dialogs prevent accidental deletions

### What You Should Add
⚠️ Rate limiting on Firebase (Firestore rules)
⚠️ Activity logging for admin actions
⚠️ Audit trail for question/content changes
⚠️ Backup strategy for Firestore data

## 🐛 Troubleshooting

### "Access denied" Error
- Ensure your user has `role: "admin"` in Firestore users collection
- Check user UID matches

### Modal not closing after save
- Check browser console for JavaScript errors
- Verify Firestore rules allow write access

### Statistics showing 0
- Ensure collections exist in Firestore
- Check Firestore rules allow read access

### Filters not working
- Clear browser cache
- Check domain IDs match between collections

## 📚 API Reference

### admin-auth.js
```javascript
adminLogin(email, password)           // Login with verification
logout()                              // Sign out
requireAdminAuth(callback?)           // Guard middleware
getCurrentAdminUser()                 // Get current admin info
```

### admin-domains.js
```javascript
setupDomainsSection()                 // Initialize section
loadDomains()                         // Fetch from Firestore
```

### admin-topics.js
```javascript
setupTopicsSection()                  // Initialize section
loadTopics()                          // Fetch from Firestore
```

### admin-questions.js
```javascript
setupQuestionsSection()               // Initialize section
loadQuestions()                       // Fetch from Firestore
```

### admin-users.js
```javascript
setupUsersSection()                   // Initialize section
loadUsers()                           // Fetch from Firestore
```

## 🎯 Next Steps

### Enhancement Ideas
1. **Bulk Actions**: Select multiple questions for batch delete
2. **Search**: Full-text search for questions
3. **Pagination**: Handle large datasets with pagination
4. **Import/Export**: CSV import for bulk question uploads
5. **Analytics**: Dashboard showing question statistics
6. **Activity Log**: Track admin actions
7. **Custom Validation**: Check for duplicate questions or topics
8. **Question Templates**: Pre-made question structures

### Testing Checklist
- [ ] Admin can login
- [ ] Admin can access all sections
- [ ] Add domain works
- [ ] Edit domain works
- [ ] Delete domain with confirmation works
- [ ] Add topic with domain filtering works
- [ ] Add question with full validation works
- [ ] User promotion/demotion works
- [ ] Responsive design on mobile
- [ ] Toast notifications appear
- [ ] Modal closes after save

---

**Version**: 1.0  
**Last Updated**: March 31, 2026  
**Status**: Ready for Production ✅
