# SmartQuiz Project Explanation

## What is SmartQuiz?
SmartQuiz is a modern, interactive web-based quiz application designed to help users test their knowledge across various subjects. It features a sleek "dark luxury" theme and is built using simple, core web technologies (HTML, CSS, and Vanilla JavaScript) powered by a Google Firebase backend.

## How Does It Work? (The User Journey)
The application is designed to be very intuitive. Here is the step-by-step journey a normal user takes:

1. **Authentication (Login/Register):** 
   When you first open the app (`index.html`), you are greeted with a login page. New users can create an account using their email and password, while returning users can log in. This is securely handled by Firebase Authentication.

2. **Choosing a Subject (Domains):** 
   After logging in, you are taken to the Dashboard (`domains.html`). Here, you can select a broad subject area you want to be quizzed on, such as Mathematics, Science, History, etc.

3. **Selecting a Specific Topic:** 
   Once a subject is chosen, you move to the Topics page (`topics.html`). For example, if you chose Mathematics, you might now choose between Algebra, Geometry, or Calculus.

4. **Picking a Difficulty Level:** 
   Next, on the Difficulty page (`difficulty.html`), you select how hard you want the quiz to be: Easy, Medium, or Hard. This allows the app to cater to beginners and experts alike.

5. **Taking the Quiz:** 
   Finally, you arrive at the Quiz interface (`quiz.html`). 
   - You are presented with a series of multiple-choice questions.
   - You can navigate back and forth between questions using Previous and Next buttons.
   - Once you finish, the app instantly calculates your score and shows you which answers you got right or wrong.

## The Admin Portal (For Managers)
SmartQuiz isn't just for students taking quizzes; it also has a complete behind-the-scenes "Admin Portal" (`admin.html` and `admin-dashboard.html`) for teachers or administrators to manage the content. 

Administrators can:
- **View Statistics:** See how many users, questions, domains, and topics exist in total on the dashboard.
- **Manage Categories:** Add new subjects (Domains) or specific areas of study (Topics), edit existing ones, or delete them.
- **Manage Questions:** Add new quiz questions, update old ones, and set their difficulty levels and correct answers.
- **Manage Users:** View all registered users, promote someone to an admin, or remove users.

## Under the Hood (Technical Details)
For those interested in how it's built, here is the technology stack:

- **Frontend (What the user sees):** 
  - **HTML:** Provides the structure of the pages.
  - **CSS:** Styles the application, specifically using a custom dark theme with smooth animations (`style.css`).
  - **Vanilla JavaScript:** Handles all the logic, like clicking buttons, tracking scores, and moving between pages without needing heavy frameworks. ES Modules are used to keep the code organized into different files (like `auth.js`, `quiz.js`, `questions.js`).

- **Backend (Where data is stored):**
  - **Firebase Authentication:** Securely manages user sign-ups, logins, and passwords.
  - **Firebase Firestore:** A cloud database that stores all the quiz questions, the list of domains and topics, and user profile information. The app can also work using a local fallback file (`questions.js`) if the database isn't connected.

## Summary
In simple words, SmartQuiz is a complete, beautifully designed platform where users can safely log in, choose a topic they want to practice, and test their knowledge, while administrators have full control to add and update the quiz questions behind the scenes.
