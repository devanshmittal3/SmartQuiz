# SmartQuiz Admin Portal - Setup Guide

## 🚀 Quick Start

### Step 1: Create Your Admin Account

1. **Register as a Regular User**
   - Go to `http://localhost:3000/index.html` (or your app URL)
   - Click "Register"
   - Fill in your details (name, email, password)
   - Submit the registration

2. **Promote to Admin in Firestore**
   - Go to your Firebase Console
   - Navigate to Firestore Database
   - Find the `users` collection
   - Locate your user document (by your UID)
   - Add/Update field: `role: "admin"`

   **User Document Should Look Like:**
   ```json
   {
     "name": "John Admin",
     "email": "admin@example.com",
     "role": "admin",
     "createdAt": {timestamp}
   }
   ```

### Step 2: Access Admin Portal

1. Navigate to `http://localhost:3000/admin.html`
2. Login with your admin credentials
3. You'll be redirected to the admin dashboard

### Step 3: Add Initial Content

#### Add Domains First
1. Click "Manage Domains" in sidebar
2. Click "+ Add Domain"
3. Fill in:
   - Domain Name (e.g., "Mathematics")
   - Icon Emoji (e.g., "➕")
4. Click "Save Domain"

**Example Domains:**
```
Mathematics - ➕
Science - 🔬
English - 📖
Computer Science - 💻
History - 🏛️
Geographic - 🌍
Hindi - 🇮🇳
```

#### Add Topics Under Domains
1. Click "Manage Topics" in sidebar
2. Click "+ Add Topic"
3. Select Domain from dropdown
4. Enter Topic Name (e.g., "Algebra", "Calculus")
5. Click "Save Topic"

**Example Topics for Mathematics:**
```
- Algebra
- Geometry
- Calculus
- Trigonometry
- Statistics
```

#### Add Questions
1. Click "Manage Questions"
2. Click "+ Add Question"
3. Select Domain (auto-populates related topics)
4. Select Topic
5. Choose Difficulty (Easy/Medium/Hard)
6. Enter Question Text
7. Fill all 4 Options
8. Select Correct Answer (0-3)
9. Click "Save Question"

## 📊 Firestore Security Rules (Important!)

Add these rules to your Firestore to ensure proper access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == userId || request.auth.token.admin;
      allow delete: if request.auth.token.admin;
    }

    // Public collections (readable by authenticated users)
    match /domains/{domainId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.admin;
    }

    match /topics/{topicId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.admin;
    }

    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.admin;
    }
  }
}
```

**Note:** Firebase Auth doesn't allow client-side custom claims. You'll need to use Firebase Admin SDK in Cloud Functions or update rules manually based on Firestore `role` field.

## 🔄 Common Tasks

### Manage Users

**View All Users:**
1. Click "Manage Users" in sidebar
2. All users are displayed with:
   - Name
   - Email
   - Current Role (Admin/User)
   - Created Date

**Promote to Admin:**
1. Find the user
2. Click "Promote" button
3. Confirm the action
4. User's role changes to admin

**Remove Admin Privileges:**
1. Click "Demote" button on admin user
2. Confirm the action
3. User becomes regular user

**Delete User:**
1. Click "Delete" button
2. Confirm deletion (cannot be undone)
3. User account is removed

### Manage Content

**Edit Domain:**
1. Go to "Manage Domains"
2. Click "Edit" on domain card
3. Update name/icon
4. Click "Save Domain"

**Delete Domain:**
1. Click "Delete" on domain card
2. Confirm deletion
3. ⚠️ Warning: All related topics/questions should be deleted first

**Edit Topic:**
1. Go to "Manage Topics"
2. Optionally filter by domain
3. Click "Edit" on topic card
4. Update details
5. Click "Save Topic"

**Edit Question:**
1. Go to "Manage Questions"
2. Use filters to find question
3. Click "Edit" on question card
4. Update all fields
5. Click "Save Question"

## 🎨 Customization

### Add Custom Domains/Topics
Modify the domain/topic seeds in your data by:
1. Adding directly through admin portal (recommended)
2. Using Firebase Console
3. Batch import via Cloud Functions

### Styling
All admin styles are in `style.css` under the "ADMIN DASHBOARD STYLES" section. Feel free to customize colors, spacing, etc.

## 🔍 Testing Your Setup

### Test Checklist
```
✅ Admin can login at /admin.html
✅ Dashboard shows statistics
✅ Can add a domain
✅ Can add a topic under that domain
✅ Can add a question under that topic
✅ Can view all users
✅ Can promote/demote users
✅ Responsive design works on mobile
✅ Toast notifications appear for actions
✅ Confirmation dialogs appear for delete
```

## ⚠️ Important Notes

### Before Going to Production

1. **Set Proper Firestore Rules**
   - Use security rules above
   - Test rules thoroughly
   - Never use "open to all" rules

2. **Create Backup Strategy**
   - Regular Firestore exports
   - Version control for content
   - Test restore procedures

3. **User Management**
   - Document which users have admin access
   - Regularly review admin users
   - Remove inactive admins

4. **Performance**
   - Monitor Firestore usage
   - Consider pagination for large datasets
   - Index commonly filtered fields

5. **Validation**
   - Questions should have diverse difficulty
   - Topics should be well-organized
   - Regular content audits

## 🆘 Troubleshooting

### Admin login redirects to admin.html
**Problem**: Your user doesn't have admin role
**Solution**: Check Firestore users collection and add `role: "admin"` field

### Can't create questions
**Problem**: Missing domains or topics
**Solution**: Create domains first, then topics, then questions

### Modal not opening
**Problem**: JavaScript error
**Solution**: Check browser console (F12) for errors

### Firestore permissions error
**Problem**: Security rules blocking access
**Solution**: Update Firestore rules or check authentication

### Questions not showing in quiz
**Problem**: Incorrect domain/topic references
**Solution**: Verify domain and topic IDs match exactly

## 📧 Admin Best Practices

1. **Review Questions Regularly**
   - Check for typos and clarity
   - Ensure correct answers are correct
   - Update outdated content

2. **Monitor User Growth**
   - Check user statistics
   - Identify popular domains/topics
   - Adjust content based on usage

3. **Content Organization**
   - Keep domain/topic hierarchy clean
   - Remove unused items
   - Maintain consistency in naming

4. **Security**
   - Only grant admin access when needed
   - Use strong passwords
   - Audit admin activity

---

**Ready to start?** Go to `/admin.html` and login! 🎉

Questions? Check `ADMIN_PORTAL.md` for detailed documentation.
