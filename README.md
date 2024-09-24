# Client Project Structure

This is the structure of the client-side project for the exam preparation system.

## Project Structure
```bash
/client
├── /public
├── /src
│   ├── /common
│   │   ├── Header.jsx
│   │   ├── Footer.jsx 
│   │   └── Button.jsx
│   ├── /components
│   │   ├── /Layout
│   │   │   └── Sidebar.jsx
│   │   ├── /Form
│   │   │   ├── InputField.jsx
│   │   │   └── TextAreaField.jsx
│   │   ├── /Learner
│   │   │   ├── LearnerDashboard.jsx
│   │   │   └── LearnerExamList.jsx
│   │   ├── /Instructor
│   │   │   ├── InstructorDashboard.jsx
│   │   │   └── ManageExams.jsx
│   │   └── /Admin
│   │       ├── AdminDashboard.jsx
│   │       └── ManageUsers.jsx
│   ├── /pages
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── LearnerPage.jsx
│   │   ├── InstructorPage.jsx
│   │   └── AdminPage.jsx
│   ├── /utils
│   │   └── api.js
│   ├── /hooks
│   │   └── useAuth.js
│   ├── /styles
│   │   └── tailwind.css
│   ├── App.jsx
│   ├── index.jsx
└── package.json
